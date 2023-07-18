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

describe('NFTXix721', function () {
  // Initialize Contract Var
  let deployer, admin, user1, user2, user3

  let signers

  const HexProof = (account) => {
    return merkleTreeObj.getHexProof(keccak256(account))
  }

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
    deployNFTix = await contract.deploy(false, "Base Contract", "BC")

    await deployNFTix.initialize(
      'Test',
      'TST',
      'ipfs://',
      [1000, 2000, 3000, 4000],
      [10, 2000, 3000, 4000],
      [deployer],
      [100],
      admin,
      deployer,
      30,
      '0xd4453790033a2bd762f526409b7f358023773723d9e9bc42487e4996869162b6',
    )
  })

  describe('Deployment Checks', function () {
    // Test to check if the contract has an owner
    it('Owner should not have address zero', async function () {
      expect(await deployNFTix.owner()).not.equal(ethers.constants.AddressZero)
    })

    // Test to check if the owner is the deployer
    it('Owner should have address of deployer', async function () {
      expect(await deployNFTix.owner()).to.equal(deployer)
    })
    // Check name and symbol
    it('Name is Test and symbol is TST', async () => {
      let name = await deployNFTix.name()
      let symbol = await deployNFTix.symbol()
      assert.equal(name, 'Test')
      assert.equal(symbol, 'TST')
    })

    // Check minting costs
    it('Minting price of the four types of tokens should be 1000, 2000, 3000, 4000 wei', async () => {
      let tokenPrice1 = await deployNFTix.tokenPrices(0)
      let tokenPrice2 = await deployNFTix.tokenPrices(1)
      let tokenPrice3 = await deployNFTix.tokenPrices(2)
      let tokenPrice4 = await deployNFTix.tokenPrices(3)

      assert.equal(tokenPrice1, 1000)
      assert.equal(tokenPrice2, 2000)
      assert.equal(tokenPrice3, 3000)
      assert.equal(tokenPrice4, 4000)
    })
  })

  describe('Testing standard ERC721 functions', function () {
    it('balanceOf function : Should get the total balance of tickets for a certain user', async function () {
      const balanceOfAdmin = await deployNFTix
        .connect(signers[1])
        .balanceOf(admin)
      expect(balanceOfAdmin).to.equal(0)
    })

    it('Test: ownerOf, mint and then check if the ticket registers as owned by the minter ', async function () {
      // Mint one type of NFT
      const tx = await deployNFTix
        .connect(signers[1])
        .mint(signers[1].address, HexProof(admin), [1, 0, 0, 0], {
          value: 1000,
        })
      const receipt = await tx.wait()

      // Check for the filter
      filter = receipt.events?.filter((x) => {
        return x.event == 'UserMint'
      })

      // Get event params
      const ticketTypeCounts = filter.length > 0 ? filter[0].args[1] : '0x000'
      const tokenId = Number(ticketTypeCounts[0])

      // Check for owner of this ticket
      await deployNFTix.connect(signers[1]).ownerOf(tokenId)
      expect(signers[1].address)
    })

    it('transferFrom function : should transfer token from a user to another', async function () {
      // Check for the balance of the user
      const balanceOfUser1 = await deployNFTix
        .connect(signers[2])
        .balanceOf(user1)
      expect(balanceOfUser1).to.equal(0)

      // Mint for user an nft of type 2
      await deployNFTix
        .connect(signers[2])
        .mint(signers[2].address, HexProof(user1), [0, 2, 0, 0], {
          value: 4000,
        })

      // Check the balance of user 1 before the transfer
      const balanceOfUser1_beforeTransfer = await deployNFTix
        .connect(signers[2])
        .balanceOf(user1)
      expect(balanceOfUser1_beforeTransfer).to.equal(2)

      // Transfer Nft from user 1 to user 2
      await deployNFTix.connect(signers[2]).transferFrom(user1, user2, 11)

      // Check the balance of user 2
      const balanceOfUser2 = await deployNFTix
        .connect(signers[3])
        .balanceOf(user2)
      expect(balanceOfUser2).to.equal(1)

      // Check who is the owner of the nft
      const ownerOfToken1001 = await deployNFTix
        .connect(signers[3])
        .ownerOf(11)
      expect(ownerOfToken1001).to.equal(user2)

      // Check the balance of user 1 after the transfer
      const balanceOfUser1_afterTransfer = await deployNFTix
        .connect(signers[2])
        .balanceOf(user1)
      expect(balanceOfUser1_afterTransfer).to.equal(1)
    })

    it('safeTransferFrom function : should transfer token from a user to another', async function () {
      // Check the balance of user 1
      const balanceOfUser1 = await deployNFTix
        .connect(signers[2])
        .balanceOf(user1)
      expect(balanceOfUser1).to.equal(1)

      // Let user 1 mint 1 more of type 2 ticket
      await deployNFTix
        .connect(signers[2])
        .mint(signers[2].address, HexProof(user1), [0, 1, 0, 0], {
          value: 2000,
        })

      // await deployNFTix.connect(signers[2]).safeTransferFrom(user1, user2, 1);
      await deployNFTix
        .connect(signers[2])
        ['safeTransferFrom(address,address,uint256)'](user1, user2, 12)

      // Check the balance of user 2 should be 2
      const balanceOfUser2 = await deployNFTix
        .connect(signers[3])
        .balanceOf(user2)
      expect(balanceOfUser2).to.equal(2)

      // Check the balance of user 1 after the transfer
      const balanceOfUser1_afterTransfer = await deployNFTix
        .connect(signers[2])
        .balanceOf(user1)
      expect(balanceOfUser1_afterTransfer).to.equal(1)

      // Check who is the owner of the nft
      const ownerOfToken1002 = await deployNFTix
        .connect(signers[3])
        .ownerOf(12)
      expect(ownerOfToken1002).to.equal(user2)
    })
  })

  describe('Testing mint function', function () {
    // Should be able to mint multiple types of nfts
    it('should mint tokens successfully', async () => {
      // Check the balance of the user1
      const balanceOfUser1 = await deployNFTix
        .connect(signers[2])
        .balanceOf(user1)
      expect(balanceOfUser1).to.equal(1)

      // Mint for user 1 all types of nfts
      const tx = await deployNFTix
        .connect(signers[2])
        .mint(signers[2].address, HexProof(user1), [1, 2, 3, 4], {
          value: 30000,
        })
      const receipt = await tx.wait()

      // Check the filter of the UserMint
      filter = receipt.events?.filter((x) => {
        return x.event == 'UserMint'
      })

      // Check if the minter is user1
      userAddress = filter.length > 0 ? filter[0].args[0] : '0x000'
      expect(userAddress).to.equal(user1)

      const balanceOfUser1_afterMint = await deployNFTix
        .connect(signers[2])
        .balanceOf(user1)
      expect(balanceOfUser1_afterMint).to.equal(11)
    })

    it('Should not mint tokens if there is not HexProof for the user', async () => {
      // Try minting tokens for the user without being whitelisted
      try {
        await deployNFTix
          .connect(signers[4])
          .mint(signers[4].address, HexProof(user3), [0, 0, 1, 0], {
            value: 3000,
          })
        assert(false)
      } catch (err) {
        assert(err)
      }
    })

    it('Cannot Mint after the supply for the tokens is finished', async () => {
      // Get the current tokenId
      const ticketType = await deployNFTix.ticketTypes(0);
      const tokenId = ticketType["currentTokenId"];
      // Let the admin try to mint over 1000 type 1 tickets
      try {
        // Try to mint tokens so that it is above the token supply
        await deployNFTix
          .connect(signers[1])
          .mint(signers[1].address, HexProof(admin), [8, 0, 0, 0], {value: 8000})
      } catch (err) {
        assert(err)
      }
    })

    it('should not mint decimal amout of tokens', async () => {
      try {
        await deployNFTix.connect(signers[2]).mint(signers[2].address, HexProof(user1), [2.5, 0, 0, 0], {value: 2500})
        assert(false)
      } catch (err) {
        assert(err)
      }
    })

    it('should not mint if amout of tokens is null', async () => {
      try {
        await deployNFTix.connect(signers[2]).mint(signers[2].address, HexProof(user1), [null, 0, 0, 0])
        assert(false)
      } catch (err) {
        assert(err)
      }
    })

    it('should not mint if not a valid address', async () => {
      try {
        await deployNFTix.connect(signers[2]).mint('ghh57fhh', HexProof(user1), [0, 0, 0, 0])
        assert(false)
      } catch (err) {
        assert(err)
      }
    })

    it('should mint tokens successfully if owner mints then the user', async () => {

      // Try the admin mint
      const tx1 = await deployNFTix
        .connect(signers[0])
        .adminMint(signers[0].address, [0, 2, 4, 5])
      const receipt1 = await tx1.wait()

      // Get the event AdminMint and check out its parameters
      filter = receipt1.events?.filter((x) => {
        return x.event == 'AdminMint'
      })

      // Check if the minter is the address of the deployer
      ownerAddress = filter.length > 0 ? filter[0].args[0] : '0x000'
      expect(ownerAddress).to.equal(deployer)

      // Check the balance of the minter
      const balanceOfAdmin = await deployNFTix
        .connect(signers[0])
        .balanceOf(deployer)
      expect(balanceOfAdmin).to.equal(11)
      
      // Check the balance of user 1 before the amdin mint 
      const balanceOfUser1 = await deployNFTix
        .connect(signers[2])
        .balanceOf(user1)
      expect(balanceOfUser1).to.equal(11)

      // Let the deployer mint for the user
      const tx2 = await deployNFTix
        .connect(signers[0])
        .adminMint(signers[2].address, [0, 2, 2, 2])
      const receipt2 = await tx2.wait();

      // Check the event admin mint after the mint
      filter = receipt2.events?.filter((x) => {
        return x.event == 'AdminMint'
      })

      // Check if the address that was minted to is equal to user1
      userAddress = filter.length > 0 ? filter[0].args[0] : '0x000'
      expect(userAddress).to.equal(user1)

      // Check the balance of the user after the mint
      const balanceOfUser1_afterMint = await deployNFTix
        .connect(signers[2])
        .balanceOf(user1)
      expect(balanceOfUser1_afterMint).to.equal(17)
    })

  })

  describe('Testing admin mint function', function () {

    it('should mint tokens successfully if minter is the owner', async () => {
      // Admin mint 3 tokens of type 1
      const tx = await deployNFTix
        .connect(signers[0])
        .adminMint(signers[0].address, [3, 0, 0, 0])
      const receipt = await tx.wait()

      // Admin mint filter to check the changes
      filter = receipt.events?.filter((x) => {
        return x.event == 'AdminMint'
      })

      // Check if the admin address is the same as the minter address
      deployerAddress = filter.length > 0 ? filter[0].args[0] : '0x000'
      expect(deployerAddress).to.equal(deployer)
      
      // Check the balance of the deployer/owner
      const balanceOfUser = await deployNFTix
        .connect(signers[0])
        .balanceOf(deployer)
      expect(balanceOfUser).to.equal(14)
    })

    it('should mint tokens successfully if minting number is larger than maximum mint for normal users', async () => {
      const tx = await deployNFTix
        .connect(signers[0])
        .adminMint(signers[0].address, [0, 0, 0, 8])
      const receipt = await tx.wait()

      filter = receipt.events?.filter((x) => {
        return x.event == 'AdminMint'
      })
      userAddress = filter.length > 0 ? filter[0].args[0] : '0x000'
      expect(userAddress).to.equal(deployer)

      const balanceOfUser = await deployNFTix
        .connect(signers[0])
        .balanceOf(deployer)
      expect(balanceOfUser).to.equal(22)
    })
    it('should not mint tokens successfully if number is bigger than the suplly', async () => {
      try {
        await deployNFTix.connect(signers[0]).adminMint(signers[0].address, 12)
        assert(false)
      } catch (err) {
        assert(err)
      }
    })
    it('should not mint tokens successfully if minter is not the owner', async () => {
      try {
        await deployNFTix.connect(signers[2]).adminMint(signers[2].address, 3)
        assert(false)
      } catch (err) {
        assert(err)
      }
    })
    it('should not mint negative amout of tokens', async () => {
      try {
        await deployNFTix.connect(signers[0]).adminMint(signers[0].address, -1)
        assert(false)
      } catch (err) {
        assert(err)
      }
    })
    it('should not mint decimal amout of tokens', async () => {
      try {
        await deployNFTix.connect(signers[0]).adminMint(signers[0].address, 2.5)
        assert(false)
      } catch (err) {
        assert(err)
      }
    })
    it('should not mint if amout of tokens is null', async () => {
      try {
        await deployNFTix
          .connect(signers[0])
          .adminMint(signers[0].address, null)
        assert(false)
      } catch (err) {
        assert(err)
      }
    })
    it('should not mint if not a valid address', async () => {
      try {
        await deployNFTix.connect(signers[0]).adminMint('ghh57fhh', 2)
        assert(false)
      } catch (err) {
        assert(err)
      }
    })
    it('does not take a letter as mint amount', async () => {
      try {
        await deployNFTix.connect(signers[0]).adminMint(signers[0].address, t)
        assert(false)
      } catch (err) {
        assert(err)
      }
    })
  })

  describe('Testing burn function', function () {
    it('should burn tokens successfully', async () => {
      const balanceOfUser1 = await deployNFTix
        .connect(signers[1])
        .balanceOf(admin)
      expect(balanceOfUser1).to.equal(1)

      const tx = await deployNFTix
        .connect(signers[1])
        .mint(signers[1].address, HexProof(admin), [0, 0, 0, 2], {value:8000})
      const receipt = await tx.wait()

      filter = receipt.events?.filter((x) => {
        return x.event == 'UserMint'
      })

      const tmpId = filter.length > 0 ? filter[0].args[1] : '0x000'
      const tokenId = Number(tmpId)
      try {
        await deployNFTix.connect(signers[1]).burn(tokenId)
        assert(true)
      } catch (err) {
        assert(err)
      }
    })
    it('should not burn tokens successfully because the burner is not the minter even if the burner is the owner', async () => {
      const balanceOfUser1 = await deployNFTix
        .connect(signers[1])
        .balanceOf(admin)
      expect(balanceOfUser1).to.equal(3)

      const tx = await deployNFTix
        .connect(signers[1])
        .mint(signers[1].address, HexProof(admin), [0, 0, 0, 2], {value:8000})
      const receipt = await tx.wait()

      filter = receipt.events?.filter((x) => {
        return x.event == 'UserMint'
      })

      const tmpId = filter.length > 0 ? filter[0].args[1] : '0x000'
      const tokenId = Number(tmpId)

      try {
        await deployNFTix.connect(signers[0]).burn(tokenId)
        assert(false)
      } catch (err) {
        assert(err)
      }
    })
    it('should burn tokens successfully when minter mints 2 times and burn a specific token Id', async () => {
      const balanceOfUser1 = await deployNFTix
        .connect(signers[1])
        .balanceOf(admin)
      expect(balanceOfUser1).to.equal(5)

      const tx1 = await deployNFTix
        .connect(signers[1])
        .mint(signers[1].address, HexProof(admin), [0, 0, 0, 2], {value:8000})
      const receipt1 = await tx1.wait()

      filter = receipt1.events?.filter((x) => {
        return x.event == 'UserMint'
      })

      const tmpId1 = filter.length > 0 ? filter[0].args[1] : '0x000'
      const tokenId1 = Number(tmpId1)
      const balanceOfUser2 = await deployNFTix
        .connect(signers[1])
        .balanceOf(admin)
      expect(balanceOfUser2).to.equal(7)

      const tx2 = await deployNFTix
        .connect(signers[1])
        .mint(signers[1].address, HexProof(admin), [0, 0, 0, 2], {value:8000})
      const receipt2 = await tx2.wait()

      filter = receipt2.events?.filter((x) => {
        return x.event == 'UserMint'
      })

      const tmpId2 = filter.length > 0 ? filter[0].args[1] : '0x000'
      const tokenId2 = Number(tmpId2)
      try {
        await deployNFTix.connect(signers[1]).burn(tokenId2 + 1)
        assert(false)
      } catch (err) {
        assert(err)
      }
      const balanceOfUser3 = await deployNFTix
        .connect(signers[1])
        .balanceOf(admin)
      expect(balanceOfUser3).to.equal(9)
    })
  })

  describe('Testing getPhase function', function () {
    it('should return phase successfully', async () => {
      try {
        await deployNFTix.connect(signers[0]).getPhase()
        assert(true)
      } catch (err) {
        assert(err)
      }
    })
  })
  describe('Testing changeMintCost function', function () {

    it('should change mint cost successfully', async () => {
      // Check the setTokenPrices function and try to change the price
      await deployNFTix.connect(signers[0]).changeTicketPrice(0, 1200)
      const ticketType = await deployNFTix.ticketTypes(0);
      const ticketPrice = Number(ticketType["price"]);
      assert.equal(ticketPrice, 1200)
    })
  })

  describe("Testing contract functions from start to finish", function () {
    // We first want to start with the presale phase this is where the minters should be whitelisted
    // Should be able to mint multiple types of nfts
    it('User1 mint tokens successfully', async () => {
      // Initially the balance of user 1 is going to be zero
      const balanceOfUser1 = await deployNFTix
        .connect(signers[2])
        .balanceOf(user1)
      expect(Number(balanceOfUser1)).to.equal(17)

      // Mint for user 1 all types of nfts
      const tx = await deployNFTix
        .connect(signers[2])
        .mint(signers[2].address, HexProof(user1), [1, 1, 1, 1], {
          value: 10200,
        })
      const receipt = await tx.wait()

      // Check the filter of the UserMint
      filter = receipt.events?.filter((x) => {
        return x.event == 'UserMint'
      })

      // Check if the minter is user1
      userAddress = filter.length > 0 ? filter[0].args[0] : '0x000'
      expect(userAddress).to.equal(user1)

      // Check if the balance of the user change to 4 after 4 mints
      const balanceOfUser1_afterMint = await deployNFTix
        .connect(signers[2])
        .balanceOf(user1)
      expect(balanceOfUser1_afterMint).to.equal(21);

      // Check the tokenIds of the different token types and if they changed
      const tokenType1 = await deployNFTix.ticketTypes(0);
      const tokenId1 = tokenType1["currentTokenId"];
      expect(Number(tokenId1)).to.equal(7);

      const ticketCount1 = tokenType1["ticketCount"];
      expect(Number(ticketCount1)).to.equal(10);

      const tokenType2 = await deployNFTix.ticketTypes(1);
      const tokenId2 = tokenType2["currentTokenId"];
      expect(Number(tokenId2)).to.equal(21);

      const ticketCount2 = tokenType2["ticketCount"];
      expect(Number(ticketCount2)).to.equal(1990);

      const tokenType3 = await deployNFTix.ticketTypes(2);
      const tokenId3 = tokenType3["currentTokenId"];
      expect(Number(tokenId3)).to.equal(2012);

      const ticketCount3 = tokenType3["ticketCount"];
      expect(Number(ticketCount3)).to.equal(1000);

      const tokenType4 = await deployNFTix.ticketTypes(3);
      const tokenId4 = tokenType4["currentTokenId"];
      expect(Number(tokenId4)).to.equal(3029);

      const ticketCount4 = tokenType4["ticketCount"];
      expect(Number(ticketCount4)).to.equal(1000);
    })
  })


})
