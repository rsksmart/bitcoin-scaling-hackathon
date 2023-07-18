require('@nomicfoundation/hardhat-toolbox')
require('hardhat-gas-reporter')
require('@nomiclabs/hardhat-etherscan')
const fs = require('fs')
const { task } = require('hardhat/config')

const INFURA_API_KEY = '3425fce4e7524b28bfc1fbf00146d955'
const key_TESTNET = fs.readFileSync('.test.secret').toString().trim()

task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.17',
    settings: {
      optimizer: {
        enabled: true,
        runs: 2000,
      },
    },
  },

  gasReporter: {
    currency: 'ETH',
    gasPrice: 12,
    enabled: true,
  },

  etherscan: {
    apiKey: {
      goerli: '9R57SZRBR48WT9JRZXNYE12G7353MARV6P',
      sepolia: '9R57SZRBR48WT9JRZXNYE12G7353MARV6P',
    },
  },

  hardhat: {},
  networks: {
    goerli: {
      url: `https://goerli.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [key_TESTNET],
      timeout: 180000,
      pollingInterval: 8000,
      gas: 7500000,
      gasPrice: 80000000000,
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [key_TESTNET],
      timeout: 180000,
      pollingInterval: 8000,
      gas: 7500000,
      gasPrice: 80000000000,
    },
    'base-goerli': {
      url: 'https://goerli.base.org',
      accounts: [key_TESTNET],
    },
    xinfin: {
      url: `https://erpc.xinfin.network`,
      accounts: [key_TESTNET],
    },
    apothem: {
      url: `https://erpc.apothem.network`,
      accounts: [key_TESTNET],
    },
    rsktestnet: {
      chainId: 31,
      url: 'https://public-node.testnet.rsk.co/',
      accounts: [key_TESTNET]
    }
  },
}
