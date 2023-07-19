const path = require('path')

async function main() {
  // This is just a convenience check
  if (network.name === 'hardhat') {
    console.warn(
      'You are trying to deploy a contract to the Hardhat Network, which' +
        'gets automatically created and destroyed every time. Use the Hardhat' +
        " option '--network localhost'",
    )
  }

  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners()
  console.log(
    'Deploying the contracts with the account:',
    await deployer.getAddress(),
  )

  console.log('Account balance:', (await deployer.getBalance()).toString())

  const Factory = await ethers.getContractFactory('Factory')
  const factory = await Factory.deploy()
  await factory.deployed()

  console.log('Factory address:', factory.address)

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(factory)
}

function saveFrontendFiles(factory) {
  const fs = require('fs')
  const contractsDir = path.join(
    __dirname,
    '..',
    'frontend',
    'contracts',
    'compiled',
  )

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir)
  }

  fs.writeFileSync(
    path.join(contractsDir, 'contract-address.json'),
    JSON.stringify({ Factory: factory.address }, undefined, 2),
  )

  const FactoryArtifact = artifacts.readArtifactSync('Factory')

  fs.writeFileSync(
    path.join(contractsDir, 'Factory.json'),
    JSON.stringify(FactoryArtifact, null, 2),
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
