const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("WOOYPODs", function () {
  let WooyPods;
  let wooyPods;

  beforeEach(async function () {
    WooyPods = await ethers.getContractFactory("WOOYPODs");
    wooyPods = await WooyPods.deploy();
    await wooyPods.deployed();
  });

  it("Debe permitir mintear un token", async function () {
    const uri = "https://ipfs.io/ipfs/QmTy1WguLcpxABXUJWtmB2ABKLMHNNYUtsuDNz47tmaMrZ";
    const userTokenValue = ethers.utils.formatBytes32String("asd@asd.com");


    const wallet = ethers.Wallet.createRandom();

    await wooyPods.safeMint(
      wallet.address, // dirección del destinatario
      uri,
      userTokenValue
    );

    const tokenId = await wooyPods.getTokenIdByUserToken(userTokenValue);
    expect(tokenId).to.equal(0);
  });
});