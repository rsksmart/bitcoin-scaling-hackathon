const  fs  =  require("fs")
const  { network, ethers }  =  require("hardhat")
const  { proposalsFile, developmentChains, VOTING_PERIOD } =  require( "../helper-hardhat-config")
const  { moveBlocks }  =  require("../utils/move-blocks")


async function main() {
    const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8")); 
    // get last vote
    const proposalId = proposals[network.config.chainId].at(-1); 
    const voteWay = 1; 
    const reason = "The following change is interesting"; 
    await vote(proposalId, voteWay, reason); 
}

export async function vote(proposalId, voteWay, reason) {
    console.log("Voting..."); 
    const governor = await ethers.getContract("GovernorContract"); 
    const voteTx = await governor.castVoteWithReason(proposalId, voteWay, reason); 
    const voteTxReceipt = await voteTx.wait(1); 
    console.log(voteTxReceipt.events[0].args.reason); 
    const proposalState = await governor.state(proposalId); 
    console.log(`Current Proposal State: ${proposalState}`); 
    if (developmentChains.includes(network.name)) {
        await moveBlocks(VOTING_PERIOD + 1); 
    }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
