'use strict';
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const expect = chai.expect;
const ethers = require('ethers');

const { Context } = require('fabric-contract-api');
const { ChaincodeStub } = require('fabric-shim');

const Chaincode = require('../contracts/fabricToken.js');

let assert = sinon.assert;
chai.use(sinonChai);

let chaincode = new Chaincode();
let ctx;
let stub;

beforeEach(() => {
    ctx = new Context();

    stub = sinon.createStubInstance(ChaincodeStub);
    ctx.stub = stub;

    chaincode = new Chaincode();
});

afterEach(() => {
    sinon.restore();
});

describe('FabricToken Chaincode Tests', () => {
    describe('Test InitIdentity', () => {
        it('should initialize identity successfully with signature verification', async function () {
            // Generate a random private key and signer.
            const signer = ethers.Wallet.createRandom();

            const address = signer.address;
            const timestamp = 'timestamp';

            const message = ethers.utils.arrayify(ethers.utils.id(''));
            const signature = signer.signMessage(message);

            const args = [address, timestamp, JSON.stringify(message), signature];

            // Mock required methods for InitIdentity
            sinon.stub(chaincode, 'IdentityExists').returns(Promise.resolve(false));
            stub.putState.resolves();

            // Call InitIdentity
            const response = await chaincode.InitIdentity(ctx, ...args);

            expect(response.status).to.equal(200);
            sinon.assert.calledWith(stub.putState, address, sinon.match.string);
        });
    });

    describe('Test IssueTokens', () => {
        it('should issue tokens successfully', async function () {
            const address = 'address';
            const value = 'value';
            const timestamp = 'timestamp';
            const tx = JSON.stringify({});

            const args = [address, value, timestamp, tx];

            // Mock required methods for IssueTokens
            stub.putState.resolves();

            // Call IssueTokens
            const response = await chaincode.IssueTokens(ctx, ...args);

            expect(response.status).to.equal(200);
            sinon.assert.calledWith(stub.putState, address, sinon.match.string);
        });
    });

    describe('Test DissolveTokens', () => {
        it('should dissolve tokens successfully', async function () {
            const address = 'address';
            const value = 'value';
            const signature = 'signature';
            const timestamp = 'timestamp';

            const args = [address, value, signature, timestamp];

            // Mock required methods for DissolveTokens
            stub.putState.resolves();

            // Call DissolveTokens
            const response = await chaincode.DissolveTokens(ctx, ...args);

            expect(response.status).to.equal(200);
            sinon.assert.calledWith(stub.putState, address, sinon.match.string);
        });
    });

    describe('Test TransferTokens', () => {
        it('should transfer tokens successfully', async function () {
            const from = 'from';
            const to = 'to';
            const value = 'value';
            const timestamp = 'timestamp';
            const message = JSON.stringify({});
            const signature = 'signature';

            const args = [from, to, value, timestamp, message, signature];

            // Mock required methods for TransferTokens
            stub.putState.resolves();

            // Call TransferTokens
            const response = await chaincode.TransferTokens(ctx, ...args);

            expect(response.status).to.equal(200);
            sinon.assert.calledWith(stub.putState, from, sinon.match.string);
            sinon.assert.calledWith(stub.putState, to, sinon.match.string);
        });
    });

    describe('Test CheckTransactionData', () => {
        it('should get transaction data successfully', async function () {
            const username = 'username';

            const args = [username];

            // Mock required methods for CheckTransactionData
            stub.getState.resolves();

            // Call CheckTransactionData
            const response = await chaincode.CheckTransactionData(ctx, ...args);

            expect(response.status).to.equal(200);
            sinon.assert.calledWith(stub.getState, username);
        });
    });

    describe('Test IdentityExists', () => {
        it('should check identity existence successfully', async function () {
            const username = 'username';

            const args = [username];

            // Mock required methods for IdentityExists
            stub.getState.resolves();

            // Call IdentityExists
            const response = await chaincode.IdentityExists(ctx, ...args);

            expect(response.status).to.equal(200);
            sinon.assert.calledWith(stub.getState, username);
        });
    });
});
