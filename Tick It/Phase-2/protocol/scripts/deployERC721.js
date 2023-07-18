// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function deployERC721() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account", deployer);
  
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const NFTix721 = await hre.ethers.getContractFactory(
    "NFTix721"
  );
  const deployERC721 = await NFTix721.deploy(true, "RSK contract", "RSK");
  await deployERC721.deployed();
  
  console.log("NFTIx ERC721 deployed to:", deployERC721.address)
  
  return deployERC721.address;
}

deployERC721()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


