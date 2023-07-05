// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Registry {
  using SafeERC20 for IERC20;

  struct EphemeralKey {
    bytes32 x;
    bytes32 y;
    bytes1 ss;
    address token;
  }

  address constant RSK = address(0x0);

  uint8 public constant VERSION = 1;

  address private owner;
  EphemeralKey[] keys;

  constructor() {
    owner = msg.sender;
  }

  function publish(bytes32 x, bytes32 y, bytes1 ss, address token) private {
    keys.push(EphemeralKey(x, y, ss, token));
  }

  function totalKeys() view external returns (uint256 count) {
    count = keys.length;
  }

  function publishAndSendToken(bytes32 x, bytes32 y, bytes1 ss, address token, address target, uint256 amount) external {
    require(amount > 0, "R: Sending amount should be more than 0");
    require(token != address(0x0), "R: Token contract required");
    require(target != address(0x0), "R: Target address required");

    publish(x, y, ss, token);

    IERC20(token).safeTransferFrom(msg.sender, target, amount);
  }

  function publishAndSend(bytes32 x, bytes32 y, bytes1 ss, address payable target) public payable {
    require(msg.value > 0, "R: Sending amount should be more than 0");
    require(target != address(0x0), "R: Target address required");

    publish(x, y, ss, RSK);

    (bool sent, ) = target.call{value: msg.value}("");
    require(sent, "R: Failed to send Ether");
  }

  function getNextKeys(uint256 start) external view returns (EphemeralKey[10] memory) {
    EphemeralKey[10] memory gotKeys;

    uint256 end = start + 10;
    uint256 limit = (keys.length < end) ? keys.length : end;

    for (uint256 i=start; i < limit; i++) {
      gotKeys[i - start] = keys[i];
    }

    return gotKeys;
  }
}