'use strict';
require('dotenv').config();

const http = require('http');
const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const { buildCAClient, registerAndEnrollUser } = require('./CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('./AppUtil.js');
const path = require('path');
const fs = require('fs');
const express = require('express');
const { ethers } = require('ethers');

// Setting up Ethereum provider
const provider = new ethers.providers.JsonRpcProvider("https://public-node.testnet.rsk.co/");

// Constants related to the Fabric network
const channelName = 'mychannel';
const chaincodeName = 'basic';
const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');

// Setting up Express.js server
const app = express();
app.use(express.static('static'));
app.use(express.json());

// Function to enroll a new user to the Fabric network
async function enrollUser(userId) {
    try {
        const ccp = buildCCPOrg1();
        const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');
        const wallet = await buildWallet(Wallets, walletPath);
        await registerAndEnrollUser(caClient, wallet, mspOrg1, userId, 'org1.department1');
    } catch (error) {
        console.error(`******** FAILED to enroll user: ${error}`);
        process.exit(1);
    }
}

// Function to setup and connect to the gateway
async function getConnectedGateway(username) {
    const ccp = buildCCPOrg1();
    const wallet = await buildWallet(Wallets, walletPath);

    const gateway = new Gateway();
    await gateway.connect(ccp, {
        wallet,
        identity: username,
        discovery: { enabled: true, asLocalhost: true }
    });

    return gateway;
}

// Function to verify a transaction
async function verifyTransaction(txObject) {
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

// Function to verify the transfer request
async function verifyTransfer(to, amount, messageReceived) {
    const obj = { to, amount }
    const messageCreated = ethers.utils.arrayify(ethers.utils.id(JSON.stringify(obj)));

    return messageCreated.length === messageReceived.length && messageCreated.every((value, index) => value === messageReceived[index]);
}

// Handle join request
app.post('/join', async (req, res) => {
    let gateway;
    try {
        const { message, signature } = req.body;
        const recoveredAddress = ethers.utils.verifyMessage(ethers.utils.arrayify(ethers.utils.id(message)), signature);
        console.log('Received join request from:', recoveredAddress)

        const username = 'user-' + recoveredAddress;

        await enrollUser(username);
        console.log('User enrolled successfully');

        gateway = await getConnectedGateway(username);
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName, 'FabricToken');

        const timestamp = new Date().toISOString();

        await contract.submitTransaction('InitIdentity', recoveredAddress, timestamp, JSON.stringify(message), signature);
        res.status(200).json({ message: 'Identity joined successfully' });

    } catch (error) {
        console.error(`******** FAILED: ${error}`);
        res.status(500).json({ message: 'Error joining' });

    } finally {
        if (gateway) {
            gateway.disconnect();
        }
    }
});

// Handle lock transaction
app.post('/lock', async (req, res) => {
    let gateway;
    try {
        const tx = req.body;
        console.log('Received lock transaction:', tx);

        if(!await verifyTransaction(tx)) {
            console.log('Trying to trick the server?');
            res.status(400).json({ message: 'Trying to trick the server?' });
            return;
        }

        const rootstockAddress = tx.from;
        const username = 'user-' + rootstockAddress;

        gateway = await getConnectedGateway(username);
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName, 'FabricToken');

        const timestamp = new Date().toISOString();
        await contract.submitTransaction('IssueTokens', rootstockAddress, tx.value, timestamp, JSON.stringify(tx));

        res.sendStatus(200);

    } catch (error) {
        console.error(`Failed to connect to gateway with the address:`, error);
        res.status(400).json({ message: `The address does not exist` });

    } finally {
        if (gateway) {
            gateway.disconnect();
        }
    }
});

// Handle unlock request
app.post('/unlock', async (req, res) => {
    let gateway;
    try {
        const { address, value, signature } = req.body;
        console.log('Received unlock request:', { address, value, signature });

        const recoveredAddress = ethers.utils.verifyMessage(value, signature);
        if (recoveredAddress !== address) {
            console.log('Trying to trick the server with wrong transaction?');
            res.status(400).json({ message: 'Trying to trick the server with wrong transaction?' });
            return;
        }

        const username = 'user-' + recoveredAddress;

        gateway = await getConnectedGateway(username);
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName, 'FabricToken');

        const timestamp = new Date().toISOString();
        await contract.submitTransaction('DissolveTokens', recoveredAddress, value, signature, timestamp);

        res.sendStatus(200);

    } catch (error) {
        console.error(`Failed to connect to gateway with the address:`, error);
        res.status(400).json({ message: `The address does not exist` });

    } finally {
        if (gateway) {
            gateway.disconnect();
        }
    }
});

// Handle transfer request
app.post('/transfer', async (req, res) => {
    let gateway;
    try {
        const tx = req.body;
        console.log('Received transfer request:', tx);

        const messageReceived = ethers.utils.arrayify(tx.message);

        const recoveredAddress = ethers.utils.verifyMessage(messageReceived, tx.signature);
        console.log('Recovered address:', recoveredAddress);

        if (recoveredAddress === tx.to) {
            console.log('Invalid transfer request: sender and recipient are the same');
            res.status(400).json({ message: 'Invalid transfer request: sender and recipient are the same' });
            return;
        }

        if (!await verifyTransfer(tx.to, tx.amount, messageReceived)) {
            console.log('No you didn\'t!');
            res.status(400).json({ message: 'No you didn\'t!' });
            return;
        } else {
            console.log('Yes you did!');
        }

        const username = 'user-' + recoveredAddress;

        gateway = await getConnectedGateway(username);
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName, 'FabricToken');

        const timestamp = new Date().toISOString();
        await contract.submitTransaction('TransferTokens', recoveredAddress, tx.to, tx.amount, timestamp, tx.message, tx.signature);

        res.sendStatus(200);

    } catch (error) {
        console.error(`Failed to connect to gateway with the address:`, error);
        res.status(400).json({ message: `The address does not exist` });

    } finally {
        if (gateway) {
            gateway.disconnect();
        }
    }
});

// Provide transaction data
app.post('/transactionData', async (req, res) => {
    let gateway;
    try {
        const { address } = req.body;
        const username = 'user-' + address;

        gateway = await getConnectedGateway(username);
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName, 'FabricToken');

        const data = await contract.evaluateTransaction('CheckTransactionData', username);
        res.status(200).json({ data: data.toString() });

    } catch (error) {
        console.error(`Failed to connect to gateway with the address:`, error);
        res.status(400).json({ message: `The address does not exist` });

    } finally {
        if (gateway) {
            gateway.disconnect();
        }
    }
});

// Check if an address exists
app.post('/check', async (req, res) => {
    let gateway;
    try {
        const { address } = req.body;
        const username = 'user-' + address;

        gateway = await getConnectedGateway(username);
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName, 'FabricToken');

        const identityExistence = await contract.evaluateTransaction('IdentityExists', username);
        if (!identityExistence) {
            throw new Error(`${address} does not exist`);
        }

        res.sendStatus(200);

    } catch (error) {
        console.error(`Failed to connect to gateway with the address:`, error);
        res.status(400).json({ message: `The address does not exist` });

    } finally {
        if (gateway) {
            gateway.disconnect();
        }
    }
});

// Handle signing in such a way that the signature can be verified by Solidity
app.post('/soliditySign', (req, res) => {

    let privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
        console.error("No private key set in environment");
        return res.status(500).send("Server error");
    }

    const messageHash = req.body.messageHash;
    const signingKey = new ethers.utils.SigningKey(privateKey);
    const signature = signingKey.signDigest(messageHash);
    return res.json({ signature: ethers.utils.joinSignature(signature) });
});

// Create a new signer for signing unlock transactions
app.get('/newSigner', async (req, res) => {

    let newSigner = ethers.Wallet.createRandom();

    let oldSignerPrivateKey = process.env.PRIVATE_KEY;
    if (!oldSignerPrivateKey) {
        console.error("No private key set in environment");
        return res.status(500).send("Server error");
    }

    const message = ethers.utils.solidityKeccak256(['address'], [newSigner.address]);
    const messageHash = ethers.utils.hashMessage(ethers.utils.arrayify(message));
    const oldSigningKey = new ethers.utils.SigningKey(oldSignerPrivateKey);
    const signature = oldSigningKey.signDigest(messageHash);

    fs.writeFileSync('.env', `OLD_PRIVATE_KEY=${oldSignerPrivateKey}\nPRIVATE_KEY=${newSigner.privateKey}`);
    process.env.OLD_PRIVATE_KEY = oldSignerPrivateKey;
    process.env.PRIVATE_KEY = newSigner.privateKey;

    console.log("New Signer Address:", newSigner.address);

    return res.json({
        newSignerAddress: newSigner.address,
        signature: ethers.utils.joinSignature(signature)
    });
});

// Restore the old signer
app.get('/restoreOldSigner', async (req, res) => {

    let oldSignerPrivateKey = process.env.OLD_PRIVATE_KEY;
    if (!oldSignerPrivateKey) {
        console.error("No old private key set in environment");
        return res.status(500).send("Server error");
    }

    fs.writeFileSync('.env', `PRIVATE_KEY=${oldSignerPrivateKey}`);
    process.env.PRIVATE_KEY = oldSignerPrivateKey;

    console.log("Old signer restored.");

    return res.json({
        restoredPrivateKey: oldSignerPrivateKey
    });
});

// Starting the server
http.createServer(app).listen(3000, '0.0.0.0', () => {
    console.log('Server is running on https://hyperoot.blurrys.in');
});
