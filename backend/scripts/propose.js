const { ethers, network } = require("hardhat"); 
const {
	developmentChains, 
	VOTING_DELAY, 
	proposalsFile,
	FUNC, 
	PROPOSAL_DESCRIPTION, 
	NEW_TOKEN_URI 
} = require('../helper-hardhat-config'); 

const fs = require("fs"); 
const { moveBlocks } = require("../utils/move-block"); 
const { ContractTransactionResponse } = require("ethers");

async function propose(args, functionToCall, proposalDescription){
	const governor = await ethers.getContract("GovernorContract");
	const dynamicNft = await ethers.getContract("DynamicNft"); 
	const encodedFunctionCall = dynamicNft.interface.encodeFunctionData(functionToCall, args); 

	console.log(`proposing ${functionToCall} on ${await dynamicNft.getAddress()} with ${args}`); 
	console.log(`proposal Description: ${proposalDescription}`); 

	const proposeTx = await governor.propose(
		[await dynamicNft.getAddress()], 
		[2], 
		[encodedFunctionCall], 
		proposalDescription	
	); 
		
	const proposalReceipt = await proposeTx.wait(); 
	console.log(proposalReceipt);
	
	if (developmentChains.includes(network.name)) {
		await moveBlocks(VOTING_DELAY + 2); 
	}

	const proposalId = proposalReceipt.events[0].args.proposalId;
	console.log('hello')
	console.log(`Proposed with proposal Id: ${proposalId}`);

	const proposalState = await governor.state(proposalId); 
	const proposalSnapshot = await governor.proposalSnapshot(proposalId); 
	const proposalDeadline = await governor.proposalDeadline(proposalId); 

	storeProposalId(proposalId); 
	console.log(`Current Proposal State: ${proposalState}`); 	
	console.log(`Current Proposal Snapshot: ${proposalSnapShot}`); 
	console.log(`Current Proposal Deadline: ${proposalDeadline}`); 
}	

function storeProposalId(proposalId) {
  const chainId = network.config.chainId.toString();
  let proposals; 

  if (fs.existsSync(proposalsFile)) {
      proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));
  } else {
      proposals = { };
      proposals[chainId] = [];
  }   
  proposals[chainId].push(proposalId.toString());
  fs.writeFileSync(proposalsFile, JSON.stringify(proposals), "utf8");
}

propose([NEW_TOKEN_URI], FUNC, PROPOSAL_DESCRIPTION)
	.then(() => process.exit(0))
	.catch(function(err){
		console.error(err);
		process.exit(1); 
})
