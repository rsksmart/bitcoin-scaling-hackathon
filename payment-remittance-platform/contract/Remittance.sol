// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Remittance {
    struct RemittanceInfo {
        address sender;
        address receiver;
        uint amount;
        uint deadline;
        bytes32 passwordHash;
    }

    mapping(bytes32 => RemittanceInfo) public remittances;
    mapping(address => bytes32[]) public senderRemittances;
    mapping(address => bytes32[]) public receiverRemittances;

    function generateId(address sender, address receiver, bytes32 password) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(sender, receiver, password));
    }

    modifier hasEnoughBalance(uint amount) {
        require(msg.sender.balance >= amount, "Insufficient balance");
        _;
    }

    modifier hasNotExpired(uint deadline) {
        require(block.timestamp <= deadline, "Deadline has passed");
        _;
    }

    function sendRemittance(address receiver, bytes32 passwordHash, uint daysToExpiration) public payable hasEnoughBalance(msg.value) {
        bytes32 id = generateId(msg.sender, receiver, passwordHash);
        remittances[id] = RemittanceInfo(msg.sender, receiver, msg.value, block.timestamp + daysToExpiration * 1 days, passwordHash);
        senderRemittances[msg.sender].push(id);
        receiverRemittances[receiver].push(id);
    }

    function getSenderRemittances(address sender) public view returns (bytes32[] memory) {
        return senderRemittances[sender];
    }

    function getReceiverRemittances(address receiver) public view returns (bytes32[] memory) {
        return receiverRemittances[receiver];
    }

    function withdrawRemittance(bytes32 id, address sender, bytes32 password) public hasNotExpired(remittances[id].deadline) {
        require(id == generateId(sender, msg.sender, password), "Incorrect password");
        uint amount = remittances[id].amount;
        delete remittances[id];
        payable(msg.sender).transfer(amount);
    }

    function reclaimFunds(bytes32 id) public {
        require(remittances[id].sender == msg.sender, "Sender is not authorized to reclaim funds");
        require(block.timestamp > remittances[id].deadline, "Deadline has not passed yet");
        uint amount = remittances[id].amount;
        delete remittances[id];
        payable(msg.sender).transfer(amount);
    }
}
