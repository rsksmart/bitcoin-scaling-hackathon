const { ethers, network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require('../utils/verify'); 

module.exports = async ({ getNamedAccounts, deployments }) => {

    const { deploy, log } = deployments; 
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId; 

    const maxSupply = ethers.toBigInt("100000000000000000000");
    const arguments = ["GovernanceFT", "Gft", maxSupply];
    const waitBlockConfirmations = developmentChains.includes(network.name) ? 1 : 5; 

    log("----------------------- DEPLOYING GOVERNANCE TOKEN ----------------------------")
    const governanceToken = await deploy("GovernanceToken", {
        from: deployer, 
        args: arguments, 
        log: true, 
        waitConfirmations: waitBlockConfirmations
    })

    if (!developmentChains.includes(network.name)) {
        console.log("--------VERIFYING------------"); 
        await verify(governanceToken.address, arguments);
    }
}

module.exports.tags = ["all", "governance-token"]; 
