// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

/// @dev This is an interface whereby we can interact with the base ERC20 contract
interface INFTixLaunchpad {
    function createERC721(
        string memory name_,
        string memory symbol_,
        string memory uri_,
        uint256[] memory ticketPrices_,
        uint256[] memory ticketRanges_,
        address[] memory payees_,
        uint256[] memory shares_,
        address owner, 
        uint32 mintingLimit,
        bytes32 root_
    ) 
    external returns (address);
}