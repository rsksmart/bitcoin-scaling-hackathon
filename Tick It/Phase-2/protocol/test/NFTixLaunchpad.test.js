const { ethers } = require('hardhat')
const { expect, assert } = require('chai')
const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')
const fs = require('fs')

describe('NFTixLaunchpad', function () {
  // Initialize Contract Var
  let deployer, admin, user1, user2, user3

  let signers

  before(async function () {
    // Getting all the signers
    signers = await ethers.getSigners()

    // Assign addresses to roles for later use
    deployer = signers[0].address
    console.log(deployer);
    admin = signers[1].address
    user1 = signers[2].address
    user2 = signers[3].address
    user3 = signers[4].address

    // Read Contract
    const contract721 = await ethers.getContractFactory('NFTix721', deployer)

    // Deploy Contract
    deployNFTix = await contract721.deploy(true, "Samijoe", "SJH")
    console.log(deployNFTix.address);

    // Read Contract
    const contract = await ethers.getContractFactory('NFTixLaunchpad', deployer)

    // Deploy Contract
    deployNFTixLaunchpad = await contract.deploy(deployNFTix.address, deployer);
  })

  describe('Deployment Checks', function () {
    // Test to check if the contract has an owner
    it('Owner should not have address zero', async function () {
        console.log(await deployNFTix.owner());
        expect(await deployNFTix.owner()).to.equal(ethers.constants.AddressZero)
    })

    // Test to check if the contract has an owner
    it('Owner should not have address zero', async function () {
        console.log(await deployNFTixLaunchpad.owner());
        expect(await deployNFTixLaunchpad.owner()).not.equal(ethers.constants.AddressZero)
    })

    // Test to check if we can create an erc721 contract from the create721 in the launchpad
    it('Create 721 clone from the launchpad contract', async function () {
        const tx = await deployNFTixLaunchpad.connect(signers[1]).createERC721("Samijoe", "SJH", "", [1000, 2000, 3000], [1000, 2000, 3000], [deployer], [100], deployer, 30, "0xd4453790033a2bd762f526409b7f358023773723d9e9bc42487e4996869162b6");
        const receipt = await tx.wait();

        filter = receipt.events?.filter((x) => {
            return x.event == "NewClone"
        })
    })
  })
})
