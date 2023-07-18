const { ethers } = require('hardhat')
const { expect, assert } = require('chai')
const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')
const fs = require('fs')

//Load merkle tree and root
const tree = JSON.parse(fs.readFileSync('./merkle/tree.json'))

const merkleTreeObj = Object.setPrototypeOf(tree, MerkleTree.prototype)

merkleTreeObj.leaves = tree.leaves.map((leaf) => Buffer.from(leaf))

merkleTreeObj.layers = tree.layers.map((layer) =>
  layer.map((item) => Buffer.from(item)),
)

describe('TestScenariosNFTix721', function () {
  // Initialize dummy users
  let deployer, admin, user1, user2, user3, user4

  let signers

  const HexProof = (account) => {
    return merkleTreeObj.getHexProof(keccak256(account))
  }

  // Initialize the before function for deployment of the contract
  before(async function () {
    // Getting all the signers
    signers = await ethers.getSigners()

    // Assign addresses to roles for later use
    deployer = signers[0].address
    admin = signers[1].address
    user1 = signers[2].address
    user2 = signers[3].address
    user3 = signers[4].address

    // Read Contract
    const contract = await ethers.getContractFactory('NFTix721', deployer)

    // Deploy Contract
    deployNFTix = await contract.deploy(false, "TestContract", "TST1")

    await deployNFTix.initialize(
      'Test',
      'TST',
      'ipfs://',
      [1000, 2000, 3000, 4000],
      [1000, 2000, 3000, 4000],
      [deployer],
      [100],
      admin,
      deployer,
      10,
      '0xd4453790033a2bd762f526409b7f358023773723d9e9bc42487e4996869162b6',
    )
  })

  describe('Deployment Checks', function () {
    // Check if the address of the owner and deployer are not equal to zero
    it('Make sure the deployer and the platform admin addresses are not equal to zero', async function () {
      expect(await deployNFTix.owner()).not.equal(ethers.constants.AddressZero)
      expect(await deployNFTix.ticketPlatformAdmin()).not.equal(
        ethers.constants.AddressZero,
      )
    })
    // Check if the deployer address instantiated above is equal to the owner of the contract
    it('Check if the deployer is the owner of the contract', async function () {
      expect(await deployNFTix.owner()).to.equal(deployer)
    })

    // Check if the admin address instantiated above is equal to the platform admin in the contract
    it('Check if the admin is the platformAdmin chosen in the contract', async function () {
      expect(await deployNFTix.ticketPlatformAdmin()).to.equal(admin)
    })

    // Check if the name and symbol and uri is equal to the deployment parameters
    it('Check if the name and symbol are equal to the deployment parameters', async function () {
      expect(await deployNFTix.name()).to.equal('Test')
      expect(await deployNFTix.symbol()).to.equal('TST')
    })

    // Check the prices and ranges of the tickets on deployment
    it('Check if the prices and the ranges of the ticket and all their properties if they match the deployment parameters', async function () {
      // Check for each ticket type its properties
      for (i = 0; i < 4; i++) {
        const ticketType = await deployNFTix.ticketTypes(i)
        const ticketCountPerType = ticketType['ticketCount']
        expect(ticketCountPerType).to.equal(1000)
      }

      // Check for type 1 of tickets
      const ticketType0 = await deployNFTix.ticketTypes(0)
      const tokenCountId0 = ticketType0['ticketCount']
      const startTokenId0 = ticketType0['startTokenId']
      const endTokenId0 = ticketType0['endTokenId']
      const price0 = ticketType0['price']
      const currentTokenId0 = ticketType0['currentTokenId']

      expect(tokenCountId0).to.equal(1000)
      expect(startTokenId0).to.equal(1)
      expect(endTokenId0).to.equal(1000)
      expect(price0).to.equal(1000)
      expect(currentTokenId0).to.equal(1)

      // Check for type 2 of tickets
      const ticketType1 = await deployNFTix.ticketTypes(1)
      const tokenCountId1 = ticketType1['ticketCount']
      const startTokenId1 = ticketType1['startTokenId']
      const endTokenId1 = ticketType1['endTokenId']
      const price1 = ticketType1['price']
      const currentTokenId1 = ticketType1['currentTokenId']

      expect(tokenCountId1).to.equal(1000)
      expect(startTokenId1).to.equal(1001)
      expect(endTokenId1).to.equal(2000)
      expect(price1).to.equal(2000)
      expect(currentTokenId1).to.equal(1001)

      // Check for type 3 of tickets
      const ticketType2 = await deployNFTix.ticketTypes(2)
      const tokenCountId2 = ticketType2['ticketCount']
      const startTokenId2 = ticketType2['startTokenId']
      const endTokenId2 = ticketType2['endTokenId']
      const price2 = ticketType2['price']
      const currentTokenId2 = ticketType2['currentTokenId']

      expect(tokenCountId2).to.equal(1000)
      expect(startTokenId2).to.equal(2001)
      expect(endTokenId2).to.equal(3000)
      expect(price2).to.equal(3000)
      expect(currentTokenId2).to.equal(2001)

      // Check for type 4 of tickets
      const ticketType3 = await deployNFTix.ticketTypes(3)
      const tokenCountId3 = ticketType3['ticketCount']
      const startTokenId3 = ticketType3['startTokenId']
      const endTokenId3 = ticketType3['endTokenId']
      const price3 = ticketType3['price']
      const currentTokenId3 = ticketType3['currentTokenId']

      expect(tokenCountId3).to.equal(1000)
      expect(startTokenId3).to.equal(3001)
      expect(endTokenId3).to.equal(4000)
      expect(price3).to.equal(4000)
      expect(currentTokenId3).to.equal(3001)

      // From this test we can know that there are 4 ticket types and each ticket has
      // a count of 1000 tickets
      // Ticket1: 1 ---> 1000 inclusive
      // Ticket1: 1001 ---> 2000 inclusive
      // Ticket1: 2001 ---> 3000 inclusive
      // Ticket1: 3001 ---> 4000 inclusive
    })
  })

  describe('Minting: Real life scenarios', function () {
    // Since there is a minting limit of 10 for now
    // Let user 1 try to mint 10 of the same kind of ticket and check the properties of the ticket

    it('Let user 1 mint 10 of ticket type 1 and check the properties of this ticket type', async function () {
      // Check the balance of user 1 and make sure it is zero
      const balanceOfUser1 = await deployNFTix
        .connect(signers[2])
        .balanceOf(user1)
      expect(Number(balanceOfUser1)).to.equal(0)

      // Mint for user 1 10 of ticket type 1
      const mintUser1 = await deployNFTix
        .connect(signers[2])
        .mint(signers[2].address, HexProof(user1), [10, 0, 0, 0], {
          value: 10000,
        })

      const receipt = await mintUser1.wait()

      // Check the filter of the UserMint
      filter = receipt.events?.filter((x) => {
        return x.event == 'UserMint'
      })

      // Check if the minter is user1
      userAddress = filter.length > 0 ? filter[0].args[0] : '0x000'
      expect(userAddress).to.equal(user1)

      // Check the balance of user1 and make sure it is 10
      const balanceOfUser1_afterMint = await deployNFTix
        .connect(signers[2])
        .balanceOf(user1)
      expect(Number(balanceOfUser1_afterMint)).to.equal(10)

      // Check the mapping to see if the contract registered the user mints
      const balanceOfUser1_mintsPerUser = await deployNFTix
        .connect(signers[2])
        .mintsPerUser(user1)
      expect(Number(balanceOfUser1_mintsPerUser)).to.equal(10)

      // Check the mapping to see if the contract registered the user mints per ticket types
      const balanceOfUser1_mintsPerType = await deployNFTix
        .connect(signers[2])
        .mintsPerUserPerType(0, user1)
      const balanceOfUser1_mintsPerType1 = await deployNFTix
        .connect(signers[2])
        .mintsPerUserPerType(1, user1)
      expect(Number(balanceOfUser1_mintsPerType)).to.equal(10)
      expect(Number(balanceOfUser1_mintsPerType1)).to.equal(0)

      // Check for ticket currentTokenId and if they have registered the mints that happenend
      const ticketType0 = await deployNFTix.ticketTypes(0)
      const currentTokenId0 = ticketType0['currentTokenId']

      // This is the number that is expected to be minted next time
      expect(Number(currentTokenId0)).to.equal(11)

      // Check for ticket currentTokenId and if they have registered the mints that happenend
      const ticketType1 = await deployNFTix.ticketTypes(1)
      const currentTokenId1 = ticketType1['currentTokenId']

      // This is the number that is expected to be minted next time
      expect(Number(currentTokenId1)).to.equal(1001)
    })

    it('Let user 1 try to mint any type of nft and it should fail because the user passed the minting limit', async function () {
      try {
        // Mint for user 1 1 of ticket type 2
        await deployNFTix
          .connect(signers[2])
          .mint(signers[2].address, HexProof(user1), [0, 1, 0, 0], {
            value: 2000,
          })
        assert.fail('Expected an error but mint succeeded.') // Fail the test if no error is thrown
      } catch (error) {
        assert(error)
      }
    })

    // Let user 2 try to mint 10 of multiple kinds of tickets and check the properties of the ticket type
    it('Let user 2 mint 10 of multiple ticket types and check the properties of this ticket type', async function () {
      // Check the balance of user 2 and make sure it is zero
      const balanceOfUser2 = await deployNFTix
        .connect(signers[3])
        .balanceOf(user2)
      expect(Number(balanceOfUser2)).to.equal(0)

      // Mint for user 1 10 of multiple types
      const mintUser2 = await deployNFTix
        .connect(signers[3])
        .mint(signers[3].address, HexProof(user2), [1, 1, 2, 2], {
          value: 17000,
        })

      const receipt = await mintUser2.wait()

      // Check the filter of the UserMint
      filter = receipt.events?.filter((x) => {
        return x.event == 'UserMint'
      })

      // Check if the minter is user1
      userAddress = filter.length > 0 ? filter[0].args[0] : '0x000'
      expect(userAddress).to.equal(user2)

      // Check the balance of user1 and make sure it is 10
      const balanceOfUser2_afterMint = await deployNFTix
        .connect(signers[3])
        .balanceOf(user2)
      expect(Number(balanceOfUser2_afterMint)).to.equal(6)

      // Check the mapping to see if the contract registered the user mints
      const balanceOfUser2_mintsPerUser = await deployNFTix
        .connect(signers[3])
        .mintsPerUser(user2)
      expect(Number(balanceOfUser2_mintsPerUser)).to.equal(6)

      // Check the mapping to see if the contract registered the user mints per ticket types
      const balanceOfUser2_mintsPerType = await deployNFTix
        .connect(signers[3])
        .mintsPerUserPerType(0, user2)
      const balanceOfUser2_mintsPerType1 = await deployNFTix
        .connect(signers[3])
        .mintsPerUserPerType(1, user2)
      const balanceOfUser2_mintsPerType2 = await deployNFTix
        .connect(signers[3])
        .mintsPerUserPerType(2, user2)
      const balanceOfUser2_mintsPerType3 = await deployNFTix
        .connect(signers[3])
        .mintsPerUserPerType(3, user2)
      expect(Number(balanceOfUser2_mintsPerType)).to.equal(1)
      expect(Number(balanceOfUser2_mintsPerType1)).to.equal(1)
      expect(Number(balanceOfUser2_mintsPerType2)).to.equal(2)
      expect(Number(balanceOfUser2_mintsPerType3)).to.equal(2)

      // Check for ticket currentTokenId and if they have registered the mints that happenend
      const ticketType0 = await deployNFTix.ticketTypes(0)
      const currentTokenId0 = ticketType0['currentTokenId']

      // This is the number that is expected to be minted next time
      expect(Number(currentTokenId0)).to.equal(12)

      // Check for ticket currentTokenId and if they have registered the mints that happenend
      const ticketType1 = await deployNFTix.ticketTypes(1)
      const currentTokenId1 = ticketType1['currentTokenId']

      // This is the number that is expected to be minted next time
      expect(Number(currentTokenId1)).to.equal(1002)

      // Check for ticket currentTokenId and if they have registered the mints that happenend
      const ticketType2 = await deployNFTix.ticketTypes(2)
      const currentTokenId2 = ticketType2['currentTokenId']

      // This is the number that is expected to be minted next time
      expect(Number(currentTokenId2)).to.equal(2003)

      // Check for ticket currentTokenId and if they have registered the mints that happenend
      const ticketType3 = await deployNFTix.ticketTypes(3)
      const currentTokenId3 = ticketType3['currentTokenId']

      // This is the number that is expected to be minted next time
      expect(Number(currentTokenId3)).to.equal(3003)
    })

    it('Let user 2 try to mint any type of nft and it should fail because the user passed the minting limit', async function () {
      try {
        // Mint for user 2 of ticket type 2
        await deployNFTix
          .connect(signers[3])
          .mint(signers[3].address, HexProof(user2), [0, 5, 0, 0], {
            value: 10000,
          })
        assert.fail('Expected an error but mint succeeded.') // Fail the test if no error is thrown
      } catch (error) {
        assert(error)
      }
    })

    it("Check if the tokenId belongs to the right owner", async function() {
      // Checkint ownerOf function and see oif the nfts are owned by the right addresses
      const ownerTokenId1 = await deployNFTix.ownerOf(1);
      expect(ownerTokenId1).to.equal(user1)

      const ownerTokenId10 = await deployNFTix.ownerOf(10);
      expect(ownerTokenId10).to.equal(user1)

      const ownerTokenId3001 = await deployNFTix.ownerOf(3001);
      expect(ownerTokenId3001).to.equal(user2)

      const ownerTokenId2002 = await deployNFTix.ownerOf(2002);
      expect(ownerTokenId2002).to.equal(user2)
    })

    it("Use admin mint to mint 2 types of nfts for user 2 where their limit is surpassed", async function() {
      // Mint for user 1 10 of multiple types
      const adminMintUser2 = await deployNFTix
        .connect(signers[0])
        .adminMint(signers[3].address, [0, 0, 2, 2]);

      const receipt = await adminMintUser2.wait()

      // Check the filter of the UserMint
      filter = receipt.events?.filter((x) => {
        return x.event == 'AdminMint'
      })

      // Check if the minter is user1
      userAddress = filter.length > 0 ? filter[0].args[0] : '0x000'
      expect(userAddress).to.equal(user2)

      // Check the balance of user1 and make sure it is 10
      const balanceOfUser2_afterMint = await deployNFTix
        .connect(signers[3])
        .balanceOf(user2)
      expect(Number(balanceOfUser2_afterMint)).to.equal(10)

      // Check the mapping to see if the contract registered the user mints
      const balanceOfUser2_mintsPerUser = await deployNFTix
        .connect(signers[3])
        .mintsPerUser(user2)
      expect(Number(balanceOfUser2_mintsPerUser)).to.equal(10)

      // Check the mapping to see if the contract registered the user mints per ticket types
      const balanceOfUser2_mintsPerType = await deployNFTix
        .connect(signers[3])
        .mintsPerUserPerType(0, user2)
      const balanceOfUser2_mintsPerType1 = await deployNFTix
        .connect(signers[3])
        .mintsPerUserPerType(1, user2)
      const balanceOfUser2_mintsPerType2 = await deployNFTix
        .connect(signers[3])
        .mintsPerUserPerType(2, user2)
      const balanceOfUser2_mintsPerType3 = await deployNFTix
        .connect(signers[3])
        .mintsPerUserPerType(3, user2)
      expect(Number(balanceOfUser2_mintsPerType)).to.equal(1)
      expect(Number(balanceOfUser2_mintsPerType1)).to.equal(1)
      expect(Number(balanceOfUser2_mintsPerType2)).to.equal(4)
      expect(Number(balanceOfUser2_mintsPerType3)).to.equal(4)

      // Check for ticket currentTokenId and if they have registered the mints that happenend
      const ticketType0 = await deployNFTix.ticketTypes(0)
      const currentTokenId0 = ticketType0['currentTokenId']

      // This is the number that is expected to be minted next time
      expect(Number(currentTokenId0)).to.equal(12)

      // Check for ticket currentTokenId and if they have registered the mints that happenend
      const ticketType1 = await deployNFTix.ticketTypes(1)
      const currentTokenId1 = ticketType1['currentTokenId']

      // This is the number that is expected to be minted next time
      expect(Number(currentTokenId1)).to.equal(1002)

      // Check for ticket currentTokenId and if they have registered the mints that happenend
      const ticketType2 = await deployNFTix.ticketTypes(2)
      const currentTokenId2 = ticketType2['currentTokenId']

      // This is the number that is expected to be minted next time
      expect(Number(currentTokenId2)).to.equal(2005)

      // Check for ticket currentTokenId and if they have registered the mints that happenend
      const ticketType3 = await deployNFTix.ticketTypes(3)
      const currentTokenId3 = ticketType3['currentTokenId']

      // This is the number that is expected to be minted next time
      expect(Number(currentTokenId3)).to.equal(3005)


      // From this test we can know that there are 4 ticket types and each ticket has
      // a count of 1000 tickets
      // Ticket1: counter; 12
      // Ticket1: counter; 1002
      // Ticket1: counter; 2005
      // Ticket1: counter; 3005
    })
  })
})
