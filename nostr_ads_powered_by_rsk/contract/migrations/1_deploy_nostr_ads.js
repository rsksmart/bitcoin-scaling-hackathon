const NostrAds = artifacts.require("NostrAds");
const MockDoc = artifacts.require("MockDoc");
const Schnorr = artifacts.require("Schnorr");

module.exports = async function(deployer) {
  await deployer.deploy(MockDoc);
  await deployer.deploy(Schnorr);
  await deployer.link(Schnorr, NostrAds);
  return (await deployer.deploy(NostrAds, MockDoc.address));
};
