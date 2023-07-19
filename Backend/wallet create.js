const Web3 = require('web3');
const { ethers } = require('ethers');
const providerUrl = 'https://public-node.rsk.co';
const web3Provider = new Web3.providers.HttpProvider(providerUrl);
const web3 = new Web3(web3Provider);
const wallet = ethers.Wallet.createRandom();
const privateKey = wallet.privateKey;
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);
const address = account.address;
console.log('Wallet address:', address);
const nftContractABI = ...; // Replace with the ABI of the NFT contract
const nftContractAddress = ...; // Replace with the address of the NFT contract
const nftContract = new web3.eth.Contract(nftContractABI, nftContractAddress);
const tokenId = 1; // Replace with the desired token ID
const tokenURI = 'https://example.com/token1'; // Replace with the token URI
const mintTransaction = nftContract.methods.mint(address, tokenId, tokenURI);
const mintTransactionData = mintTransaction.encodeABI();
const txData = {
  from: address,
  to: nftContractAddress,
  data: mintTransactionData,
};
web3.eth.sendTransaction(txData)
  .on('transactionHash', function(hash) {
    console.log('Mint transaction hash:', hash);
  })
  .on('receipt', function(receipt) {
    console.log('Mint transaction receipt:', receipt);
  });
