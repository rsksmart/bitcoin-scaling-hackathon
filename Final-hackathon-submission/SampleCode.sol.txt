// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

contract MyFinLC{
    uint Credit = 3850030975442828281;
    uint Fees = 2390500000; 
    uint Expense = 239095000;
    address payable Receiver = payable(0x5B38Da6a701c568545dCfcB03FcB875f56beddC4);
    address payable owner;
    address payable Creditor = payable(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2);
    address payable shuttlecock = payable(0x617F2E2fD72FD9D5503197092aC168c91465E7f2);
    uint StartDate; 

    constructor() {
        owner = payable(msg.sender);
        StartDate = block.timestamp;
    }


    function CheckReqirement() public view returns (uint) {
        return (Credit+Fees+Expense+10 - address(this).balance);
    }

    function Deposit(uint _Amount) public payable returns(uint) {
          require(msg.sender==Creditor, "This LC isn't intended for you");
          require(address(this).balance == 0, "You already have Deposited");
          require(_Amount==Credit+Fees+Expense+10, "Please put amount equal to the Requirement");
          return address(this).balance;
    }

    function CheckBalance() public view returns (uint) {
         require(msg.sender==Creditor || msg.sender==Receiver || msg.sender==owner, "This SC isn't intended for you");
         return address(this).balance;
    }
    
    function TriggerPayment(uint ClaimCode) payable public {
        require(msg.sender==shuttlecock, "You Don't have this right");

        if(block.timestamp - StartDate > 2592000) {
            Creditor.transfer(Credit);
        } else if(ClaimCode == 283945138293) {
            Receiver.transfer(Credit);
        } else if(ClaimCode == 837293081928293) {
            Creditor.transfer(Credit);
        } else {revert();}
        
        shuttlecock.transfer(Expense);
        owner.transfer(address(this).balance);
    }

        

} 
