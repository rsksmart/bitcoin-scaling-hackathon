require("dotenv").config();
var HDWalletProvider = require("@truffle/hdwallet-provider");

var mnemonic = process.env.MNEMONIC;
var publicTestnetNode = "https://public-node.testnet.rsk.co/";

module.exports = {
  networks: {
    rskTestnet: {
      provider: () => new HDWalletProvider(mnemonic, publicTestnetNode),
      network_id: 31,

      networkCheckTimeout: 1e9,
    },
  },
  compilers: {
    solc: {
      version: "0.8.17",
      evmVersion: "byzantium",
    },
  },
};
