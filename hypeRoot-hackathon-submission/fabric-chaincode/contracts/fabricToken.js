'use strict';

const { Contract } = require('fabric-contract-api');
const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { ethers } = require('ethers');

class FabricToken extends Contract {

    async verifyTransaction(txObject) {
        const provider = new ethers.providers.JsonRpcProvider('https://public-node.testnet.rsk.co/');
    
        const tx = await provider.getTransaction(txObject.hash);
    
        if (tx.from.toLowerCase() !== txObject.from.toLowerCase()) {
            return false;
        }
        if (tx.to.toLowerCase() !== txObject.to.toLowerCase()) {
            return false;
        }
        if (tx.data !== txObject.data) {
            return false;
        }
        return tx.value.eq(txObject.value);
    }

    async verifyAmount(data, amount) {
        const amountHex = data.slice(10);
        const amountWei = ethers.BigNumber.from('0x' + amountHex);
    
        return amountWei.eq(ethers.BigNumber.from(amount));
    }

    async verifyTransfer(to, amount, messageReceived) {
        const obj = { to, amount }
        const messageCreated = ethers.utils.arrayify(ethers.utils.id(JSON.stringify(obj)));

        return messageCreated.length === messageReceived.length && messageCreated.every((value, index) => value === messageReceived[index]);
    }

    async InitIdentity(ctx, rootstockAddress, timestamp, message, signature) {

        const recoveredAddress = ethers.utils.verifyMessage(ethers.utils.arrayify(ethers.utils.id(JSON.parse(message))), signature);
        if (recoveredAddress !== rootstockAddress) {
            throw new Error(`Mr. Bad Guy! You are not ${rootstockAddress}!`);
        }

        const username = 'user-' + rootstockAddress;
        const exists = await this.IdentityExists(ctx, username);
        if (exists) {
            throw new Error(`The Rootstock Identity ${username} already exists`);
        }
        const token = {
            RootstockAddress: rootstockAddress,
            FabricTokens: ethers.BigNumber.from("0").toString(),
            lastUpdated: timestamp,
            transactions: []
        };
        await ctx.stub.putState(username, Buffer.from(stringify(sortKeysRecursive(token))));
        return JSON.stringify(token);
    }

    async IssueTokens(ctx, rootstockAddress, fabricTokens, timestamp, tx) {

        tx = JSON.parse(tx);
        if(!await this.verifyTransaction(tx)) {
            throw new Error('Trying to trick the chaincode? Really?');
        }

        const username = 'user-' + rootstockAddress;
        const exists = await this.IdentityExists(ctx, username);
        if (!exists) {
            throw new Error(`The Rootstock Identity ${username} does not exist`);
        }
        const tokenBytes = await ctx.stub.getState(username);
        const token = JSON.parse(tokenBytes.toString());

        const transactionFeeWei = ethers.utils.parseEther('0.00001');
        const fabricTokensBigNumber = ethers.BigNumber.from(fabricTokens);
        const netFabricTokens = fabricTokensBigNumber.sub(transactionFeeWei);

        token.FabricTokens = ethers.BigNumber.from(token.FabricTokens).add(netFabricTokens).toString();
        token.lastUpdated = timestamp;

        token.transactions.push({
            type: 'issue',
            amount: netFabricTokens.toString(),
            date: timestamp
        });
        await ctx.stub.putState(username, Buffer.from(stringify(sortKeysRecursive(token))));
        return JSON.stringify(token);
    }

    async DissolveTokens(ctx, rootstockAddress, fabricTokens, signature, timestamp) {

        const recoveredAddress = ethers.utils.verifyMessage(fabricTokens, signature);
        if (recoveredAddress !== rootstockAddress) {
            throw new Error('Trying to trick the chaincode with wrong transaction? Really?');
        }

        const username = 'user-' + recoveredAddress;
        const exists = await this.IdentityExists(ctx, username);
        if (!exists) {
            throw new Error(`The Rootstock Identity ${username} does not exist`);
        }
        const tokenBytes = await ctx.stub.getState(username);
        const token = JSON.parse(tokenBytes.toString());

        if (ethers.BigNumber.from(token.FabricTokens).lt(ethers.BigNumber.from(fabricTokens))) {
            throw new Error(`Insufficient balance`);
        }

        token.FabricTokens = ethers.BigNumber.from(token.FabricTokens).sub(ethers.BigNumber.from(fabricTokens)).toString();

        token.lastUpdated = timestamp;
        token.transactions.push({
            type: 'dissolve',
            amount: fabricTokens,
            date: timestamp
        });
        await ctx.stub.putState(username, Buffer.from(stringify(sortKeysRecursive(token))));
        return JSON.stringify(token);
    }

    async TransferTokens(ctx, fromRootstockAddress, toRootstockAddress, fabricTokens, timestamp, message, signature) {

        if (fromRootstockAddress === toRootstockAddress) {
            throw new Error('Invalid transfer request: sender and recipient are the same');
        }

        const messageReceived = ethers.utils.arrayify(message);
        const recoveredAddress = ethers.utils.verifyMessage(messageReceived, signature);

        if (recoveredAddress !== fromRootstockAddress) {
            throw new Error(`Mr. Bad Guy! You are not ${fromRootstockAddress}! You are ${recoveredAddress}`);
        }

        if (!await this.verifyTransfer(toRootstockAddress, fabricTokens, messageReceived)) {
            throw new Error(`Mr. Bad Guy! You are not ${toRootstockAddress}!`);
        }

        const fromUsername = 'user-' + fromRootstockAddress;
        const toUsername = 'user-' + toRootstockAddress;
        const fromExists = await this.IdentityExists(ctx, fromUsername);
        const toExists = await this.IdentityExists(ctx, toUsername);

        if (!fromExists) {
            throw new Error(`The Rootstock Identity ${fromUsername} does not exist`);
        }
        if (!toExists) {
            throw new Error(`The Rootstock Identity ${toUsername} does not exist`);
        }

        const fromTokenBytes = await ctx.stub.getState(fromUsername);
        const toTokenBytes = await ctx.stub.getState(toUsername);
        const fromToken = JSON.parse(fromTokenBytes.toString());
        const toToken = JSON.parse(toTokenBytes.toString());

        if (ethers.BigNumber.from(fromToken.FabricTokens).lt(ethers.BigNumber.from(fabricTokens))) {
            throw new Error(`Insufficient balance`);
        }

        fromToken.FabricTokens = ethers.BigNumber.from(fromToken.FabricTokens).sub(ethers.BigNumber.from(fabricTokens)).toString();
        toToken.FabricTokens = ethers.BigNumber.from(toToken.FabricTokens).add(ethers.BigNumber.from(fabricTokens)).toString();
        fromToken.lastUpdated = timestamp;
        toToken.lastUpdated = timestamp;

        fromToken.transactions.push({
            type: 'send',
            amount: fabricTokens,
            date: timestamp,
            to: toRootstockAddress
        });
        toToken.transactions.push({
            type: 'receive',
            amount: fabricTokens,
            date: timestamp,
            from: fromRootstockAddress
        });
        
        await ctx.stub.putState(fromUsername, Buffer.from(stringify(sortKeysRecursive(fromToken))));
        await ctx.stub.putState(toUsername, Buffer.from(stringify(sortKeysRecursive(toToken))));
        return JSON.stringify({ fromToken, toToken });
    }

    async CheckTransactionData(ctx, username) {
        const exists = await this.IdentityExists(ctx, username);
        if (!exists) {
            throw new Error(`The Rootstock Identity ${username} does not exist`);
        }
        const tokenJSON = await ctx.stub.getState(username);
        return tokenJSON.toString();
    }

    async IdentityExists(ctx, username) {
        const tokenJSON = await ctx.stub.getState(username);
        return tokenJSON && tokenJSON.length > 0;
    }
}

module.exports = FabricToken;
