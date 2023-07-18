// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { upgrades } = require("hardhat");
const hre = require("hardhat");

async function deployLaunchpad() {

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account", deployer);
  
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const NFTixLaunchpad = await hre.ethers.getContractFactory(
    "NFTixLaunchpad"
  );
  
  const deployFactory = await NFTixLaunchpad.deploy("0xA83f5f7E5BfD000aA33796c4046E8173e2181d52", "0x723D16481EafC01C68564b10f4e264fD44aB1917");
  
  console.log(deployFactory.address);
  return deployFactory.address;
}

deployLaunchpad()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });