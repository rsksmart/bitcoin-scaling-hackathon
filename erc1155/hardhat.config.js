require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: {},
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [process.env.OWNER_PRIVATE_KEY],  
      /**
       * {
        mnemonic: process.env.OWNER_PRIVATE_KEY,
      },
      **/
    },
  },
};
