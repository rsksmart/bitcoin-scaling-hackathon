const developmentChains = ["hardhat", "localhost"]; 
const QUORUM_PERCENTAGE = 4 // Need 4% of voters to pass
const MIN_DELAY = 3600 // 1 hour - after a vote passes, you have 1 hour before you can enact
const VOTING_PERIOD = 5 // blocks
const VOTING_DELAY = 1 // 1 Block - How many blocks till a proposal vote becomes active
const ADDRESS_ZERO = "0x00000000000000000000000000000000000"

const FUNC = "changeUri"
const PROPOSAL_DESCRIPTION = "Proposal #1 77 in the Box!"

module.exports = {
    developmentChains, 
    MIN_DELAY, 
    VOTING_DELAY, VOTING_PERIOD, QUORUM_PERCENTAGE, 
}
