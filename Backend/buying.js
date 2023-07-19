const Web3Deploy = require('@rootstack/web3deploy');
const web3 = new Web3Deploy('http://127.0.0.1:4444'); // Replace with your RootStack network URL

async function buyNFT(contractAddress, tokenId, buyerAddress, price) {
  const contract = new web3.eth.Contract(contractAbi, contractAddress); // Replace with your contract's ABI
  const accounts = await web3.eth.getAccounts();

  try {
    await contract.methods.buyNFT(tokenId).send({
      from: buyerAddress,
      value: price,
    });

    // Update ownership or trigger other necessary actions

    console.log('NFT purchased successfully');
  } catch (error) {
    console.error('Error purchasing NFT:', error);
  }
}

// Usage
const contractAddress = '0x...'; // Replace with your contract's deployed address
const tokenId = 1; // Replace with the desired token ID
const buyerAddress = '0x...'; // Replace with the buyer's address
const price = 100; // Replace with the agreed price in wei

buyNFT(contractAddress, tokenId, buyerAddress, price);
