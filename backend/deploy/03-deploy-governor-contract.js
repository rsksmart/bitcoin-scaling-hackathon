const { ethers, network } = require("hardhat");
const { developmentChains, QUORUM_PERCENTAGE, VOTING_DELAY, VOTING_PERIOD } = require("../helper-hardhat-config");
const { verify } = require('../utils/verify'); 

module.exports = async ({ getNamedAccounts, deployments }) => {

    const { deploy, log, get} = deployments; 
    const { deployer } = await getNamedAccounts();

    const governanceToken = await get("GovernanceToken"); 
    const timeLock = await get("TimeLock"); 

    const arguments = [
        governanceToken.address, 
        timeLock.address, 
        QUORUM_PERCENTAGE, 
        VOTING_PERIOD, 
        VOTING_DELAY
    ];
    
    const waitBlockConfirmations = developmentChains.includes(network.name) ? 1 : 5; 
    log("----------------------- DEPLOYING GOVERNANCE CONTRACT ----------------------------")

    const governorContract = await deploy("GovernorContract", {
        from: deployer, 
        args: arguments, 
        log: true, 
        waitConfirmations: waitBlockConfirmations
    })

    if (!developmentChains.includes(network.name)) {
        console.log("--------VERIFYING TIME LOCK------------"); 
        await verify(governorContract.address, arguments);
    }
}

module.exports.tags = ["all", "governor-contract"]; 
