// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function deployERC1155() {
  const [deployer] = await ethers.getSigners();

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const NFTix1155 = await hre.ethers.getContractFactory(
    "NFTix1155"
  );
  const deployERC1155 = await NFTix1155.deploy("ipfs://", "0x723D16481EafC01C68564b10f4e264fD44aB1917");
  await deployERC1155.deployed();
  
  console.log("NFTIx ERC1155 deployed to:", deployERC1155.address)
  
  return deployERC1155.address;
}

deployERC1155()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


