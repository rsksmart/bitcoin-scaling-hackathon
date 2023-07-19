'use strict';

const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const { buildCAClient, enrollAdmin } = require('./CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('./AppUtil.js');
const path = require('path');

// Define constants for the organization MSP and wallet path
const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');

async function main() {
    try {
        // Setup the CCP (Common Connection Profile)
        const ccp = buildCCPOrg1();

        // Setup the CA client
        const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');

        // Create a new file system-based wallet for managing identities.
        const wallet = await buildWallet(Wallets, walletPath);

        // Enroll admin user and import it into the wallet
        await enrollAdmin(caClient, wallet, mspOrg1);

    } catch (error) {
        // Handle and print out any errors
        console.error(`******** FAILED to enroll the admin: ${error}`);
        process.exit(1);
    }
}

main();
