const { verify } = require("../utils/verify")
const {developmentChains} = require('../helper-hardhat-config'); 
const { network, ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments; 
    const { deployer } = await getNamedAccounts(); 

    const waitBlockConfirmations = !developmentChains.includes(network.name) ? 5 : 1; 
    const arguments = ["GovernanceNFt", "GNFt", "snkdsjvsnfksnkhdvikdf"]; 
    
    log('-------------------------------deploying Dynamic NFT -----------------------'); 
    const dynamicNft = await deploy("DynamicNft", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: waitBlockConfirmations
    }); 
    log(`Dynamic Nft at address ${dynamicNft.address}`);
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(dynamicNft.address, arguments); 
    }

    const dynamicNftContract = await ethers.getContractAt("DynamicNft", deployer); 
    const timeLock = await ethers.getContract("TimeLock");
    const timeLockAddress = await timeLock.getAddress(); 
    await dynamicNftContract.transferOwnership(timeLockAddress);
}

module.exports.tags = ["all", "dynamicNft"]; 
