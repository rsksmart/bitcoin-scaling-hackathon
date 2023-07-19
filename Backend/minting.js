const Web3Deploy = require('@rootstack/web3deploy');
const web3 = new Web3Deploy('http://127.0.0.1:4444'); // Replace with your RootStack network URL

const { default: YourNFTContract } = require('minting.sol'); // Replace with the path to your Solidity contract

async function mintNFT(contractAddress, tokenId, ownerAddress, metadataURI) {
  const contract = new web3.eth.Contract(YourNFTContract.abi, contractAddress);

  try {
    const result = await contract.methods.mint(tokenId, ownerAddress, metadataURI).send({ from: ownerAddress });
    console.log('NFT minted successfully with transaction hash:', result.transactionHash);
  } catch (error) {
    console.error('Error minting NFT:', error);
  }
}

// Usage
const contractAddress = '0x...'; // Replace with your contract's deployed address
const tokenId = 1; // Replace with the desired token ID
const ownerAddress = '0x...'; // Replace with the desired owner's address
const metadataURI = 'https://example.com/metadata'; // Replace with the URI for the NFT's metadata

mintNFT(contractAddress, tokenId, ownerAddress, metadataURI);
