const { ethers } = require('hardhat')
const { expect, assert } = require('chai')
const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')
const fs = require('fs')


describe('NFTix1155', function () {
    // Initialize dummy users
  let deployer, admin, user1, user2, user3, user4

  let signers

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
    const contract = await ethers.getContractFactory('NFTix1155', deployer)

    // Deploy Contract
    deployNFTix = await contract.deploy("ipfs://", deployer);
  })

  describe("Deployment Checks", function() {
    // Check if the address of the owner and deployer are not equal to zero
    it('Make sure the deployer and the platform admin addresses are not equal to zero', async function () {
        expect(await deployNFTix.owner()).not.equal(ethers.constants.AddressZero)
    })

    // Check if the deployer address instantiated above is equal to the owner of the contract
    it('Check if the deployer is the owner of the contract', async function () {
        expect(await deployNFTix.owner()).to.equal(deployer)
    })
  });

  describe("Function Checks", function() {
    // Make sure the createEvent function works
    it('Make sure the createEvent function works by sending the contract address and it will be assigned tokenId 1', async function () {
      const createEvent = await deployNFTix.createEvent("0x723D16481EafC01C68564b10f4e264fD44aB1917");

      const receipt = await createEvent.wait();

      // Check the filter of the UserMint
      filter = receipt.events?.filter((x) => {
        return x.event == 'CreateEvent'
      });

      tokenId = filter.length > 0 ? filter[0].args[0] : '0'
      expect(tokenId).to.equal(1);
    })

    it("Check to see if the create event will assign a new tokenId for the same contract", async function() {
      try {
        await deployNFTix.createEvent("0x723D16481EafC01C68564b10f4e264fD44aB1917");
        assert.fail('Expected an error but it created an event');
      } catch (error) {
        assert(error);
      }
    })

    it('Check to see if the creation of another event increments the tokenId and assigns it to the new contract', async function () {
      const createEvent = await deployNFTix.createEvent("0x2de34Afef26F0Ee95A59C19eb7D2bf21E3fb6A9a");

      const receipt = await createEvent.wait();

      // Check the filter of the UserMint
      filter = receipt.events?.filter((x) => {
        return x.event == 'CreateEvent'
      });

      tokenId = filter.length > 0 ? filter[0].args[0] : '0'
      expect(tokenId).to.equal(2);
    })

    it("Check to see if the attendance of an event works", async function () {
      const attendEvent = await deployNFTix.attendEvent("0x723D16481EafC01C68564b10f4e264fD44aB1917", "0x723D16481EafC01C68564b10f4e264fD44aB1917");

      const receipt = await attendEvent.wait();

      // Check the filter to make sure that teh event is emitted
      filter = receipt.events?.filter((x) => {
        return x.event == 'AttendEvent'
      });

      tokenId = filter.length > 0 ? filter[0].args[0] : '0'
      contractAddress = filter.length > 0 ? filter[0].args[1] : '0'
      to = filter.length > 0 ? filter[0].args[2] : '0'
      expect(tokenId).to.equal(1);
      expect(contractAddress).to.equal("0x723D16481EafC01C68564b10f4e264fD44aB1917");
      expect(to).to.equal("0x723D16481EafC01C68564b10f4e264fD44aB1917");

      balance = await deployNFTix.balanceOf("0x723D16481EafC01C68564b10f4e264fD44aB1917", 1);
      expect(balance).to.equal(1);
    })

    it("Check to see if the attend event will mint a new token if the user tried to mint it another time, it should fail", async function() {
      try {
        await deployNFTix.attendEvent("0x723D16481EafC01C68564b10f4e264fD44aB1917", "0x723D16481EafC01C68564b10f4e264fD44aB1917");
        assert.fail('Expected an error but it created an event');
      } catch (error) {
        assert(error);
      }
    })

    it("Check to see if the attend event will mint a new token if the user tried to mint from an event that does not exist, it should fail", async function() {
      try {
        await deployNFTix.attendEvent("0xbb048783515fc1f2a1CD39FD7E6c097Fe02A73cF", "0x723D16481EafC01C68564b10f4e264fD44aB1917");
        assert.fail('Expected an error but it created an event');
      } catch (error) {
        assert(error);
      }
    })

    it("Check to see if the attendance of an event number 2 works", async function () {
      const attendEvent = await deployNFTix.attendEvent("0x2de34Afef26F0Ee95A59C19eb7D2bf21E3fb6A9a", "0x723D16481EafC01C68564b10f4e264fD44aB1917");

      const receipt = await attendEvent.wait();

      // Check the filter to make sure that teh event is emitted
      filter = receipt.events?.filter((x) => {
        return x.event == 'AttendEvent'
      });

      tokenId = filter.length > 0 ? filter[0].args[0] : '0'
      contractAddress = filter.length > 0 ? filter[0].args[1] : '0'
      to = filter.length > 0 ? filter[0].args[2] : '0'
      expect(tokenId).to.equal(2);
      expect(contractAddress).to.equal("0x2de34Afef26F0Ee95A59C19eb7D2bf21E3fb6A9a");
      expect(to).to.equal("0x723D16481EafC01C68564b10f4e264fD44aB1917");

      balance = await deployNFTix.balanceOf("0x723D16481EafC01C68564b10f4e264fD44aB1917", 2);
      expect(balance).to.equal(1);
    })

    it("Check to see userAttend function works", async function () {
      const hasAttended = await deployNFTix.userAttend("0x2de34Afef26F0Ee95A59C19eb7D2bf21E3fb6A9a", "0x723D16481EafC01C68564b10f4e264fD44aB1917");
      expect(hasAttended).to.equal(true);
    })

    it("Check to see userAttend function works", async function () {
      const hasAttended = await deployNFTix.userAttend("0x2de34Afef26F0Ee95A59C19eb7D2bf21E3fb6A9a", "0x2de34Afef26F0Ee95A59C19eb7D2bf21E3fb6A9a");
      expect(hasAttended).to.equal(false);
    })
  })

})