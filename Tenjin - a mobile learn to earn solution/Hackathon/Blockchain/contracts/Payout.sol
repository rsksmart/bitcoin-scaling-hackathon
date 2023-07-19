// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract PayOut {
    error txFailed();
    error notOwner();
    error insufficientBalance();

    uint256 public balance;
    uint256 public totalPayouts;
    uint256 public numOfPayouts;
    address private owner;

    constructor() {
        owner = msg.sender;
    }

    receive() external payable {
        balance = balance + msg.value;
    }

    function payout(address user, uint256 amount) external {
        if (msg.sender != owner) revert notOwner();
        if (amount > balance) revert insufficientBalance();
        balance = balance - amount;

        totalPayouts = totalPayouts + amount;
        numOfPayouts = numOfPayouts + 1;

        (bool sent, ) = user.call{value: amount}("");
        if (!sent) {
            revert txFailed();
        }
    }
}
