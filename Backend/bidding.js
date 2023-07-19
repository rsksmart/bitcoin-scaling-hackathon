//Install the required dependencies for your project, including the RootStack SDK and the OpenZeppelin Contracts.
//npm install @rootstack/web3deploy
//npm install @openzeppelin/contracts
const Web3Deploy = require('@rootstack/web3deploy');
const web3 = new Web3Deploy('http://127.0.0.1:4444'); // Replace with your RootStack network URL

const { default: NFTMarketplace } = require('./NFTMarketplace.sol'); // Replace with the path to your Solidity contract

async function deploy() {
  const accounts = await web3.eth.getAccounts();
  const from = accounts[0];

  const nftMarketplace = await web3.deploy({
    contract: NFTMarketplace,
    args: ['MyNFTMarketplace', 'NFTM'],
    from,
  });

  console.log('NFTMarketplace deployed at address:', nftMarketplace.options.address);
}

deploy();
