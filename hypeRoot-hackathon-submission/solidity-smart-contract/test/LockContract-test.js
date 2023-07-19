require('dotenv').config();

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const {expect} = chai;
const {ethers} = require("hardhat");
const {solidity} = require("ethereum-waffle");
chai.use(solidity);

async function soliditySign(privateKey, types, inputs) {
    const message = ethers.utils.solidityKeccak256(types, inputs);
    const messageHash = ethers.utils.hashMessage(ethers.utils.arrayify(message));
    const signingKey = new ethers.utils.SigningKey(privateKey);
    const signature = signingKey.signDigest(messageHash);
    return ethers.utils.joinSignature(signature);
}

describe("LockContract", function () {
    let LockContract, lockContract, owner, feeWallet, addr1, addr2, signerPrivateKey, newSignerPrivateKey, signer, newSigner;

    beforeEach(async function () {
        LockContract = await ethers.getContractFactory("LockContract");

        [owner, feeWallet, addr1, addr2, ...addrs] = await ethers.getSigners();

        signerPrivateKey = process.env.OLD_PRIVATE_KEY;
        newSignerPrivateKey = process.env.NEW_PRIVATE_KEY;
        signer = new ethers.Wallet(signerPrivateKey);
        newSigner = new ethers.Wallet(newSignerPrivateKey);

        lockContract = await LockContract.deploy(signer.address, feeWallet.address);

        await lockContract.deployed();
    });

    it("Should set the right signer and wallet address", async function () {
        expect(await lockContract.signerAddress()).to.equal(signer.address);
        expect(await lockContract.walletAddress()).to.equal(feeWallet.address);
    });

    describe("lockTokens", function () {
        it("should lock tokens and emit event", async function () {

            const signature = await soliditySign(signerPrivateKey, ["address"], [newSigner.address]);

            await expect(
                await lockContract.connect(addr1).lockTokens(newSigner.address, signature, {value: ethers.utils.parseEther("1")})
            ).to.emit(lockContract, 'Locked').withArgs(addr1.address, ethers.utils.parseEther("1").sub(ethers.utils.parseEther("0.00001")));

            expect(await lockContract.totalLocked()).to.equal(ethers.utils.parseEther("1").sub(ethers.utils.parseEther("0.00001")));
            expect(await lockContract.balance(addr1.address)).to.equal(ethers.utils.parseEther("1").sub(ethers.utils.parseEther("0.00001")));
            expect(await lockContract.signerAddress()).to.equal(newSigner.address);
        });

        it("should fail if not enough tokens are sent", async function () {
            const signature = await soliditySign(signerPrivateKey, ["address"], [newSigner.address]);

            await expect(
                lockContract.connect(addr1).lockTokens(newSigner.address, signature, {value: ethers.utils.parseEther("0.000009")})
            ).to.be.rejectedWith('Not enough tokens to cover the fee');
        });

        it("should fail if invalid signature is provided", async function () {
            const signature = await soliditySign(signerPrivateKey, ["address"], [addr2.address]);

            await expect(
                lockContract.connect(addr1).lockTokens(newSigner.address, signature, {value: ethers.utils.parseEther("1")})
            ).to.be.rejectedWith('Invalid signature');
        });
    });

    describe("unlockTokens", function () {
        beforeEach(async function () {
            const signature = await soliditySign(signerPrivateKey, ["address"], [newSigner.address]);
            await lockContract.connect(addr1).lockTokens(newSigner.address, signature, { value: ethers.utils.parseEther("1") });
        });

        it("should unlock tokens and emit event", async function () {
            const amountToUnlock = ethers.utils.parseEther("0.5");
            const signature = await soliditySign(newSignerPrivateKey, ["address", "uint256"], [addr1.address, amountToUnlock]);

            await expect(
                await lockContract.connect(addr1).unlockTokens(amountToUnlock, signature)
            ).to.emit(lockContract, 'Unlocked').withArgs(addr1.address, amountToUnlock);

            expect(await lockContract.totalLocked()).to.equal(ethers.utils.parseEther("0.5").sub(ethers.utils.parseEther("0.00001")));
            expect(await lockContract.balance(addr1.address)).to.equal(ethers.utils.parseEther("0.5").sub(ethers.utils.parseEther("0.00001")));
        });

        it("should fail if not enough tokens are locked", async function () {
            const amountToUnlock = ethers.utils.parseEther("1.5");
            const signature = await soliditySign(newSignerPrivateKey, ["address", "uint256"], [addr1.address, amountToUnlock]);

            await expect(
                lockContract.connect(addr1).unlockTokens(amountToUnlock, signature)
            ).to.be.rejectedWith('Not enough tokens locked');
        });

        it("should fail if invalid signature is provided", async function () {
            const amountToUnlock = ethers.utils.parseEther("0.5");
            const signature = await soliditySign(newSignerPrivateKey, ["address", "uint256"], [addr2.address, amountToUnlock]);

            await expect(
                lockContract.connect(addr1).unlockTokens(amountToUnlock, signature)
            ).to.be.rejectedWith('Invalid signature');
        });
    });

    describe("recoverTokens", function () {
        beforeEach(async function () {
            const signature = await soliditySign(signerPrivateKey, ["address"], [newSigner.address]);
            await lockContract.connect(addr1).lockTokens(newSigner.address, signature, { value: ethers.utils.parseEther("1") });
        });

        it("should recover tokens and emit event", async function () {
            const amountLocked = ethers.utils.parseEther("1").sub(ethers.utils.parseEther("0.00001"));
            const amount = ethers.utils.parseEther("0.4");
            const amountToRecover = amountLocked.sub(amount)
            const signature = await soliditySign(newSignerPrivateKey, ["address", "uint256"], [addr1.address, amount]);

            await expect(
                await lockContract.connect(addr1).recoverTokens(amount, signature)
            ).to.emit(lockContract, 'Recovered').withArgs(addr1.address, amountToRecover);

            expect(await lockContract.totalLocked()).to.equal(amountLocked.sub(amountToRecover));
            expect(await lockContract.balance(addr1.address)).to.equal(amountLocked.sub(amountToRecover));
        });

        it("should fail if not enough tokens are locked", async function () {
            const amountLocked = ethers.utils.parseEther("1").sub(ethers.utils.parseEther("0.00001"));
            const amount = ethers.utils.parseEther("1.5");
            const amountToRecover = amountLocked.sub(amount)
            const signature = await soliditySign(newSignerPrivateKey, ["address", "uint256"], [addr1.address, amount]);

            await expect(
                lockContract.connect(addr1).recoverTokens(amount, signature)
            ).to.be.rejectedWith('Not enough tokens');
        });

        it("should fail if invalid signature is provided", async function () {
            const amountLocked = ethers.utils.parseEther("1").sub(ethers.utils.parseEther("0.00001"));
            const amount = ethers.utils.parseEther("0.4");
            const amountToRecover = amountLocked.sub(amount)
            const signature = await soliditySign(newSignerPrivateKey, ["address", "uint256"], [addr2.address, amount]);

            await expect(
                lockContract.connect(addr1).recoverTokens(amount, signature)
            ).to.be.rejectedWith('Invalid signature');
        });
    });
});
