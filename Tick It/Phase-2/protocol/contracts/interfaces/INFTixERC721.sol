// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

/// @notice ERC20 interface
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @dev This is an interface whereby we can interact with the base ERC20 contract
interface INFTixERC721 is IERC20 {
    function mint(address account, uint256 amount) external payable;
    function burn(address account, uint256 amount) external;
    function initialize(
        string memory name_,
        string memory symbol_,
        string memory uri_,
        uint256[] memory ticketPrices_,
        uint256[] memory ticketRanges_,
        address[] memory payees_,
        uint256[] memory shares_,
        address defaultPlatformAdmin,
        address owner,
        uint32 mintingLimit,
        bytes32 root_
    ) external;
    function pause() external;
    function totalSupply() view external returns(uint256);
    function balanceOf(address account) external view returns (uint256);
    function owner() external view returns (address);
}