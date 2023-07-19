const { ethers } = require('hardhat')
const { expect } = require('chai')
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers')

describe('Factory contract', function () {
  // We define a fixture to reuse the same setup in every test. We use
  // loadFixture to run this setup once, snapshot that state, and reset Hardhat
  // Network to that snapshot in every test.
  async function deployFactoryFixture() {
    // Get the ContractFactory and Signers here.
    const Factory = await ethers.getContractFactory('Factory')
    const [owner, addr1, addr2] = await ethers.getSigners()
    const name = 'testToken'
    const ticker = 'TST'
    const initialSupply = '999999999999999999'

    // To deploy our contract, we just have to call Factory.deploy() and await
    // for it to be deployed(), which happens once its transaction has been
    // mined. We also deploy a token with the deployed factory contract.
    const factory = await Factory.deploy()

    await factory.deployed()
    await factory.deployToken(name, ticker, initialSupply)

    const tokenAddress = await factory.getTokenAddress(0)
    const tokenInstance = await ethers.getContractAt('Token', tokenAddress)

    return {
      factory,
      owner,
      addr1,
      addr2,
      tokenAddress,
      tokenInstance,
    }
  }

  describe('Deploy', function () {
    it('Should deploy a contract', async function () {
      const { tokenAddress } = await loadFixture(deployFactoryFixture)

      // This test expects the returned token address to be valid.
      expect(tokenAddress).to.have.lengthOf(42)
      expect(tokenAddress).to.match(/^0x?/)
    })

    it('Should transfer the total supply of tokens to the deployer', async function () {
      const { owner, tokenInstance } = await loadFixture(deployFactoryFixture)

      expect(await tokenInstance.balanceOf(owner.address)).to.equal(
        await tokenInstance.totalSupply(),
      )
    })
  })

  describe('Transactions', function () {
    it('Should transfer tokens between accounts', async function () {
      const { tokenInstance, owner, addr1, addr2 } = await loadFixture(
        deployFactoryFixture,
      )
      // Transfer 50 tokens from owner to addr1
      await expect(
        tokenInstance.transfer(addr1.address, 50),
      ).to.changeTokenBalances(tokenInstance, [owner, addr1], [-50, 50])

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await expect(
        tokenInstance.connect(addr1).transfer(addr2.address, 50),
      ).to.changeTokenBalances(tokenInstance, [addr1, addr2], [-50, 50])
    })
  })

  describe('View', function () {
    it('Should return the address of the deployed token', async function () {
      const { factory, tokenAddress } = await loadFixture(deployFactoryFixture)

      expect(await factory.getTokenAddress(0)).to.equal(tokenAddress)
    })

    it('Should return the number of deployed tokens', async function () {
      const { factory } = await loadFixture(deployFactoryFixture)
      expect(await factory.getNumberOfTokens()).to.equal(1)
    })
  })
})
