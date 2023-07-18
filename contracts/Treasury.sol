// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
// import "@openzeppelin/contracts/access/AccessControl.sol";
import "./Lending.sol";
contract Treasury is Lending{

 
   bool internal checkEligibility;
  
    uint public eligibleAmt;
   event receiveFundEvent(
     uint  indexed  amount 
   );
   event withdrawEvent(
       address  indexed borrower,
       uint indexed amount
   );

   function receiveFund() payable public{
    uint amt = super.calculateTotalPayable();
    require(msg.value>=amt,"Repay The correct amount");
    super.resetValue();
    emit receiveFundEvent(msg.value);
   }

   function withdraw (uint256  _collateralVal) public payable{
     
    eligibleAmt = super.calculateLoanAmt( _collateralVal);
    payable(msg.sender).transfer(eligibleAmt);
    emit withdrawEvent(msg.sender,eligibleAmt);
   }
   function fakeFund() public payable {}
  function checkPaybleAmt() public view returns(uint) {
    return super.calculateInterest();
  }
  function getContractBalance() public view returns(uint)
  {
    return address(this).balance;
  }
   
}