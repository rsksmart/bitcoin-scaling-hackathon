// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
contract Lending{
// calculating the value of loan on the basis of collateral 
 uint  LTV = 20;
 mapping(address=>uint) public addressToAmt;
 mapping(address=>uint) public addressToTime;
 
 function modifyLTV(uint _newVal) public {
     LTV = _newVal;
 }
 // 0.00002(RBTC)*10^8=2000RSAT
function calculateLoanAmt(uint _collateralVal) public pure returns(uint) {
 uint num = _collateralVal*20;
 uint denom = 100;
 return num/denom; // It is returning the value in RSAT
} 
 function requestForLoan(uint _collateralVal) public   {
    uint loanAmt = calculateLoanAmt(_collateralVal);
    addressToAmt[msg.sender]= loanAmt;
    addressToTime[msg.sender]=block.number;
 }

   function calculateTotalPayable() public view returns (uint) {
        uint amt = addressToAmt[msg.sender];
        uint block_difference = block.number - addressToTime[msg.sender];
        uint no_of_days = block_difference / 144;
        uint rate_of_interest = 2739; // 2739 x 10^(-5) , we manage the decimals below
        uint total_interest_non_decimal = amt * no_of_days * rate_of_interest;
        uint total_interest = total_interest_non_decimal / 100000;
        uint total_payable_amount = amt + total_interest;
        return total_payable_amount;
    }
   function calculateInterest() public view returns (uint) {
        uint amt = addressToAmt[msg.sender];
        uint block_difference = block.number - addressToTime[msg.sender];
        uint no_of_days = block_difference / 144;
        uint rate_of_interest = 2739; // 2739 x 10^(-5) , we manage the decimals below
        uint total_interest_non_decimal = amt * no_of_days * rate_of_interest;
        uint total_interest = total_interest_non_decimal / 100000;
        return total_interest;
    }
    function fetchLoanDetails() public view returns (uint)
   {    uint time;
           if(addressToTime[msg.sender]!=0){
      time =  block.number-addressToTime[msg.sender]; 
   }
   else{
    time = 0;
   }
       
     return (time);
   }
 function resetValue() internal {
     addressToAmt[msg.sender] =0;
     addressToTime[msg.sender] =0;

 }
}