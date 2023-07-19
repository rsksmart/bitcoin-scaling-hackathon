const NostrAds = artifacts.require("NostrAds");
const MockDoc = artifacts.require("MockDoc");
const SchnorrLib = artifacts.require("Schnorr");
const schnorr = require('bip-schnorr');
const assert = require('assert');

contract("NostrAds", function (accounts) {
  const admin = accounts[0];
  const campaignCreator = accounts[1];
  const aliceCollaborator = accounts[2];
  const bobCollaborator = accounts[3];

  async function forwardTime(seconds) {
    await web3.currentProvider.send({jsonrpc: "2.0", method: "evm_increaseTime", params: [seconds], id: new Date().getTime()}, () => {});
    await web3.currentProvider.send({jsonrpc: "2.0", method: "evm_mine", params: [], id: new Date().getTime()}, () => {});
  }

  it("should create campaign and issue payouts", async () => {
    // Creator already has mockDoc tokens
    const mockDoc = await MockDoc.deployed();

    const transferAmount = web3.utils.toWei("100", "ether"); // Transfer 100 stablecoin units
    await mockDoc.transfer(campaignCreator, transferAmount, { from: admin });

    const nostrAds = await NostrAds.deployed();

    // We will forward the blockchain time in these tests to target these timeframes.
    // Just keep in mind submissions end in 100 seconds. Payouts are in 200 seconds.
    const submissionDeadline = Math.floor(new Date().getTime() / 1000) + 100; 
    const payoutDate = submissionDeadline + 100;

    const rewardAmount = web3.utils.toWei("50", "ether");
    const alicePubkey = "e729580aba7b4d601c94f1d9c9ba5f37e6066c22d1351ef5d49a851de81211b9";
    const aliceP = schnorr.math.liftX(Buffer.from(alicePubkey, 'hex'));
    const alicePx = schnorr.convert.intToBuffer(aliceP.affineX);
    const alicePy = schnorr.convert.intToBuffer(aliceP.affineY);

    // Create and fund a campaign.
    // We trick the campaign into thinking it has 2 collaborators, while it's just the same.
    // But only one of these instances will claim the payout, that way we test the refund to campaignCreator.
    await mockDoc.approve(nostrAds.address, transferAmount, { from: campaignCreator });
    const campaignIndex = await nostrAds.createCampaign(
      "Remember: If anyone cancels any plan on you this weekend, they're playing the new zelda.",
      transferAmount,
      submissionDeadline,
      payoutDate,
      [
        {
          "nostrHexPubkey": "e729580aba7b4d601c94f1d9c9ba5f37e6066c22d1351ef5d49a851de81211b9",
          "rewardAmount": rewardAmount,
          "rewardAddress": aliceCollaborator,
          "nostrAffineX": alicePx,
          "nostrAffineY": alicePy
        },
        {
          "nostrHexPubkey": "e729580aba7b4d601c94f1d9c9ba5f37e6066c22d1351ef5d49a851de81211b9",
          "rewardAmount": rewardAmount,
          "rewardAddress": aliceCollaborator,
          "nostrAffineX": alicePx,
          "nostrAffineY": alicePy
        }
      ],
      { from: campaignCreator }
    );

    // Verify campaign creation
    const campaign = await nostrAds.campaigns(0);
    assert.equal(campaign.funding.toString(), transferAmount, "Reward funding mismatch");
    assert(!campaign.payoutsDone, "Payouts should not be done yet");

    assert.equal( (await mockDoc.balanceOf(campaignCreator)), 0, "creator balance should be empty.");
    assert.equal( (await mockDoc.balanceOf(aliceCollaborator)), 0, "Alice balance is empty.");
    
    const collaborator = await nostrAds.getCampaignCollaborator(0, 0);
    assert.equal(collaborator.rewardAddress, aliceCollaborator, "Collaborator address mismatch");
    assert(!collaborator.canCollect, "Collaborator shouldn't be able to collect");

    // Proof submission. We submit within the accepted timeframe.
    // Then try again for the other collaborator - which takes the same signature - but it's after the deadline, so it fails.
    const signature = Buffer.from("7aa5f6c2cd24f6fd63475fca4d632bf37ef13eb44140f11fcc52f0daabdd6f9e5054148ae0a27315eb0da4642b59ac4e9c83748136751773bf95c7992ea5d570", "hex");
    const r = signature.slice(0, 32);
    const s = signature.slice(32, 64);

    await nostrAds.submitProof(0, 0, 1683916923, r, s, { from: aliceCollaborator });
    assert((await nostrAds.getCampaignCollaborator(0, 0)).canCollect, "Collaborator should be able to collect");

    await forwardTime(101); // Now we're past submissionDeadline
    
    try {
      await nostrAds.submitProof(0, 1, 1683916923, r, s, { from: aliceCollaborator });
      assert.fail("Expected proof submisison to fail.");
    } catch { }

    // Issue payouts. First we try before payouts date, then we advance the blockchain time to make it work.
    try {
      await nostrAds.payAllCollaborators(0, { from: campaignCreator });
      assert.fail("Expected payouts to fail");
    } catch { }
    
    await forwardTime(500000);
    await nostrAds.payAllCollaborators(0, { from: campaignCreator });
    assert((await nostrAds.campaigns(0)).payoutsDone, "payouts should be done");

    // Verify payouts
    assert.equal( (await mockDoc.balanceOf(campaignCreator)).toString(), rewardAmount, "campaignCreator should have been refunded one reward amount");
    assert.equal( (await mockDoc.balanceOf(aliceCollaborator)).toString(), rewardAmount, "Alice collected one reward amount");
  });

  it("Validates schnorr signature on nostr event", async function () {
    const sample = {
      "content": "Remember: If anyone cancels any plan on you this weekend, they're playing the new zelda.",
      "created_at": 1683916923,
      "id": "34c7b3ba61e984bb370b98d67bd224c68cf6c7866837fdbf81f3b16c9b2ceee2",
      "kind": 1,
      "pubkey": "e729580aba7b4d601c94f1d9c9ba5f37e6066c22d1351ef5d49a851de81211b9",
      "sig":    "7aa5f6c2cd24f6fd63475fca4d632bf37ef13eb44140f11fcc52f0daabdd6f9e5054148ae0a27315eb0da4642b59ac4e9c83748136751773bf95c7992ea5d570",
      "tags": []
    };

    const pubKey = Buffer.from(sample.pubkey, 'hex');
    const signature = Buffer.from(sample.sig, 'hex');
    const message = Buffer.from(sample.id, 'hex');

    const P = schnorr.math.liftX(pubKey);
    const Px = schnorr.convert.intToBuffer(P.affineX);
    const Py = schnorr.convert.intToBuffer(P.affineY);
    const r = signature.slice(0, 32);
    const s = signature.slice(32, 64);
    
    let contract = await SchnorrLib.deployed();
    const tx = await contract.verify(message, Px, Py, r, s);

    assert.ok(tx, "Invalid Signature");

    const gasEstimate = await contract.verify.estimateGas(message, Px, Py, r, s);
    console.log('Gas estimate:', gasEstimate);
  });

});
