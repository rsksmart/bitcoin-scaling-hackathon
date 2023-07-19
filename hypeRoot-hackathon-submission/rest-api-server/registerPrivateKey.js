const ethers = require('ethers');
const fs = require('fs');

async function main() {
    // Create a new Ethereum wallet
    let ethWallet = ethers.Wallet.createRandom();

    // Get the private key from the new wallet
    const privateKey = ethWallet.privateKey;

    // Write the private key to a .env file
    fs.writeFileSync('.env', `PRIVATE_KEY=${privateKey}`);

    // Output the Ethereum wallet address to the console
    console.log("Address:", ethWallet.address);
}

main();
