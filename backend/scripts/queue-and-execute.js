const { ethers, network } = require("hardhat")
const {
    NEW_TOKEN_URI, 
    MIN_DELAY, 
    developmentChains,
    PROPOSAL_DESCRIPTION,
    FUNC
} = require("../helper-hardhat-config")

const { moveBlocks } = require('../utils/move-block')
const { moveTime } = require("../utils/move-time")

async function queue_execute() {
    const arguments = [NEW_TOKEN_URI];  
    const functionToCall = FUNC; 

    const dynamicNft = await ethers.getContract("DynamicNft");
    const encodedFunctionCall = dynamicNft.interface.encodeFunctionData(functionToCall, args); 
    const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION)); 

    const governor = await ethers.getContract("GovernorContract");
    console.log("Queueing..."); 
    const queueTx = await governor.queue([await dynamicNft.getAddress()], [0], [encodedFunctionCall], descriptionHash); 
    await queueTx.wait(1); 

    if (developmentChains.includes(network.name)) {
      await moveTime(MIN_DELAY + 1); 
      await moveBlocks(1); 
    }

    console.log("Executing..."); 
    // this will fail on a testnet because you need to wait for the MIN_DELAY!
    const executeTx = await governor.execute(
        [await dynamicNft.getAddress()],
        [0],
        [encodedFunctionCall],
        descriptionHash
    ); 
    await executeTx.wait(1); 
    console.log(`dynamicNft value: ${await dynamicNft.retrieve()}`); 
}

queue_execute()
    .then(() => process.exit(0))
    .catch(function(err){
        console.error(err); 
        process.exit(1);
    })
