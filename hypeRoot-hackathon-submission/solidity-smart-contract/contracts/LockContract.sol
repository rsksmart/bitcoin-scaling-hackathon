// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.18;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract LockContract is ReentrancyGuard {
    uint256 public totalLocked;
    address public signerAddress;
    address public walletAddress;
    mapping(address => int256) public balance;

    uint256 public constant FEE = 0.00001 ether;

    event Locked(address indexed user, uint256 amount);
    event Unlocked(address indexed user, uint256 amount);
    event Recovered(address indexed user, uint256 amount);

    constructor(address _signerAddress, address _walletAddress) {
        signerAddress = _signerAddress;
        walletAddress = _walletAddress;
    }

    function lockTokens(address _newSignerAddress, bytes memory _signature) public payable nonReentrant {
        require(msg.value > FEE, "Not enough tokens to cover the fee");

        bytes32 message = ECDSA.toEthSignedMessageHash(keccak256(abi.encodePacked(_newSignerAddress)));
        require(ECDSA.recover(message, _signature) == signerAddress, "Invalid signature");
        signerAddress = _newSignerAddress;

        uint256 amountToLock = msg.value - FEE;
        totalLocked += amountToLock;
        balance[msg.sender] += int256(amountToLock);

        Address.sendValue(payable(walletAddress), FEE);

        emit Locked(msg.sender, amountToLock);
    }

    function unlockTokens(uint256 _amount, bytes memory _signature) public nonReentrant {
        bytes32 message = ECDSA.toEthSignedMessageHash(keccak256(abi.encodePacked(msg.sender, _amount)));
        require(ECDSA.recover(message, _signature) == signerAddress, "Invalid signature");

        require(totalLocked >= _amount, "Not enough tokens locked");
        totalLocked -= _amount;
        balance[msg.sender] -= int256(_amount);
        payable(msg.sender).transfer(_amount);

        emit Unlocked(msg.sender, _amount);
    }

    function recoverTokens(int256 _amount, bytes memory _signature) public nonReentrant {
        bytes32 message = ECDSA.toEthSignedMessageHash(keccak256(abi.encodePacked(msg.sender, _amount)));
        require(ECDSA.recover(message, _signature) == signerAddress, "Invalid signature");

        require(balance[msg.sender] >= _amount, "Not enough tokens");

        if (balance[msg.sender] != _amount) {
            int256 difference = balance[msg.sender] - _amount;
            balance[msg.sender] -= difference;

            totalLocked -= uint256(difference);

            payable(msg.sender).transfer(uint256(difference));

            emit Recovered(msg.sender, uint256(difference));
        }
    }
}
