const { ethers, network } = require("hardhat");
const { developmentChains, MIN_DELAY } = require("../helper-hardhat-config");
const { verify } = require('../utils/verify'); 

module.exports = async ({ getNamedAccounts, deployments }) => {

    const { deploy, log } = deployments; 
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId; 

    const arguments = [MIN_DELAY, [], [], deployer];
    const waitBlockConfirmations = developmentChains.includes(network.name) ? 1 : 5; 

    log("----------------------- DEPLOYING TIME LOCK ----------------------------")
    const timeLock = await deploy("TimeLock", {
        from: deployer, 
        args: arguments, 
        log: true, 
        waitConfirmations: waitBlockConfirmations
    })

    if (!developmentChains.includes(network.name)) {
        console.log("--------VERIFYING TIME LOCK------------"); 
        await verify(timeLock.address, arguments);
    }
}

module.exports.tags = ["all", "time-lock"]; 
