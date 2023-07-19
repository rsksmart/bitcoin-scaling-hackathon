const fs = require('fs')

require('@nomiclabs/hardhat-ethers')
require('@nomicfoundation/hardhat-toolbox')
require('solidity-coverage')

/*
Issue the following command to generate a BIP-39 seed phrase
and save it to file:

npm run new-rsktestnet-seed-phrase
OR
npx mnemonics@1.1.3 > .rsktestnet-seed-phrase
*/
let rskTestnetSeedPhrase
try {
  rskTestnetSeedPhrase = fs
    .readFileSync('.rsktestnet-seed-phrase', 'utf8')
    .toString()
    .trim()
} catch (ex) {
  // console.error(ex);
}
if (!rskTestnetSeedPhrase || rskTestnetSeedPhrase.split(' ').length !== 12) {
  console.error(
    'Put valid BIP-39 seed phrase in a file ".rsktestnet-seed-phrase"',
  )
}

/*
Issue the following command to query RSK Testnet
for its latest block, and save the response to file:

curl \
  -X POST \
  --silent \
  -H "Content-Type:application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_getBlockByNumber","params":["latest", false],"id":1}' \
  https://public-node.testnet.rsk.co/ > .rsktestnet-block-rpc-response.json
*/
let rskTestnetBlockRpcResponse
let rskTestnetMinimumGasPrice
try {
  rskTestnetBlockRpcResponse = fs
    .readFileSync('.rsktestnet-block-rpc-response.json')
    .toString()
    .trim()
  rskTestnetMinimumGasPrice = parseInt(
    JSON.parse(rskTestnetBlockRpcResponse).result.minimumGasPrice,
    16,
  )
} catch (ex) {
  // console.error(ex);
}
if (
  typeof rskTestnetMinimumGasPrice !== 'number' ||
  isNaN(rskTestnetMinimumGasPrice)
) {
  console.error(
    'unable to retrieve network gas price from .rsktestnet-block-rpc-response.json',
  )
}
// console.log("Minimum gas price for RSK Testnet: " + rskTestnetMinimumGasPrice);

const rskTestnetGasMultiplier = 1.1

const rskTestnetNetworkConfig =
  !rskTestnetSeedPhrase || !rskTestnetMinimumGasPrice
    ? {
        chainId: 31,
        url: 'https://public-node.testnet.rsk.co/',
      }
    : {
        chainId: 31,
        url: 'https://public-node.testnet.rsk.co/',
        gasPrice: rskTestnetMinimumGasPrice,
        gasMultiplier: rskTestnetGasMultiplier,
        accounts: {
          mnemonic: rskTestnetSeedPhrase,
          // Ref: https://developers.rsk.co/rsk/architecture/account-based/#derivation-path-info
          path: "m/44'/60'/0'/0",
          // path: "m/44'/37310'/0'/0",
          initialIndex: 0,
          count: 10,
        },
      }

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.17',
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      chainId: 31337,
    },
    rskregtest: {
      url: 'http://localhost:4444',
    },
    rsktestnet: rskTestnetNetworkConfig,
  },
}
