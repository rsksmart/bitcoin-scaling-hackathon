const hre = require("hardhat");

async function main() {

  const WooyPods = await hre.ethers.getContractFactory("WOOYPODs");
  const wooyPods = await WooyPods.deploy();

  await wooyPods.deployed();

  console.log("Deployed to " + wooyPods.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
