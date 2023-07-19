var TreasuryContract = artifacts.require("./Treasury.sol");
var LendingContract = artifacts.require("./Lending.sol");
module.exports = function (deployer) {
  // deployment steps
  deployer.deploy(TreasuryContract);
  deployer.deploy(LendingContract);
};
