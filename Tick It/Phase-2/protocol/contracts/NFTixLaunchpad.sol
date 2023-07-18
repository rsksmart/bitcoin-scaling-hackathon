// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/// @notice Contract cloning library
import "@openzeppelin/contracts/proxy/Clones.sol";
/// @notice Ownable contract pattern
import "@openzeppelin/contracts/access/Ownable.sol";
/// @notice Reentrancy guard library
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
/// @notice NFTix ERC165 Interface
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "hardhat/console.sol";


/// @notice NFTix ERC721 Interface
import "./interfaces/INFTixERC721.sol";
import "./interfaces/INFTixLaunchpad.sol";

/// @notice Same Address Error
error SameAddress();
/// @notice Zero Address Error
error ZeroAddress();
/// @notice Transaction Fallback Disabled
error FallbackDisabled();

/**
 * @title NFTix ERC721 Launchpad
 * @notice ERC721 Launchpad Factory contract
 * @author NFTix Protocol | cryptoware.eth
 */
contract NFTixLaunchpad is
    Ownable,
    ReentrancyGuard,
    INFTixLaunchpad,
    ERC165
{
    /// @notice cheaply clone contract functionality in an immutable way
    using Clones for address;

    /// @notice Event emitted when a new ERC721 clone is created
    event NewClone(address indexed _newClone, address indexed _owner);

    /// @notice Event emitted when a new implementation of the ERC721 is created and the base ERC721 contract changes
    event ImplementationERC721Changed(address indexed ERC721Base);

    /// @notice Base ERC721 address
    address public Base;

    /// @notice ERC721 contracts mapped by owner address
    address[] public clones;

    /// @notice Admin address being set on each deployment of a 721 contract
    address public defaultPlatformAdmin;

    /// @notice disabling fallback recieve
    receive() external payable {
        revert FallbackDisabled();
    }
    fallback() external payable {
        revert FallbackDisabled();
    }

     /**
     * @notice Constructor
     * @param BaseERC721 address of the Base ERC721 contract
     * @param defaultPlatformAdmin_ is the address of the ERC721 contract being deployed and has certain roles
     */
    constructor(address BaseERC721, address defaultPlatformAdmin_) Ownable() {

        console.logBytes4(type(INFTixLaunchpad).interfaceId);
        if (BaseERC721 == address(0)) revert ZeroAddress();

        // Check if the defaultPlatformAdmin is a zero address
        if (defaultPlatformAdmin_ == address(0)) revert ZeroAddress();

        defaultPlatformAdmin = defaultPlatformAdmin_;
        Base = BaseERC721;
    }

    /**
     * @notice create and initializing the cloned contract
     * @param _name ERC721 name
     * @param _symbol ERC721 symbol
     * @param _uri ERC721 base URI
     * @param _ticketPrices is the array of prices each price represents a ticket type
     * @param _ticketRanges is the array of rangees each range is the amount of tickets per type
     * @param _payees is the array of address that will receive the benefits
     * @param _shares is the array of numbers of how the shares will be split
     * @param _root is the root of the merkle tree for whitelist authentication 
     **/
    
    function createERC721(
        string memory _name,
        string memory _symbol,
        string memory _uri,
        uint256[] memory _ticketPrices,
        uint256[] memory _ticketRanges,
        address[] memory _payees,
        uint256[] memory _shares,
        address owner,
        uint32 mintingLimit,
        bytes32 _root
    )
        external
        nonReentrant
        returns (address)
    {
        address identicalChild = Base.clone();

        INFTixERC721(identicalChild).initialize(_name, _symbol, _uri, _ticketPrices, _ticketRanges, _payees, _shares, defaultPlatformAdmin, owner, mintingLimit, _root);

        clones.push(identicalChild);

        emit NewClone(identicalChild, msg.sender);

        return identicalChild;
    }

    /**
     * @notice changeERC721Implementation is used when we want to change the base ERC721 to add or remove features
     * @param _newAddress is the new ERC721 address with changes
     */
    function changeERC721Implementation(address _newAddress) external onlyOwner {
        require(_newAddress != address(0), "InvalidAddress");
        require(_newAddress != Base, "Same address error");

        Base = _newAddress;
        
        emit ImplementationERC721Changed(_newAddress);
    }

    /**
     * @notice changeDefaultPlatformAdmin is used when the default admin address needs to be changed before creation of 721 address
     * @param _newDefaultAdminAddress is the new address of the admin
     */
    function changeDefaultPlatformAdmin(address _newDefaultAdminAddress) public onlyOwner {
        require(_newDefaultAdminAddress != address(0) || _newDefaultAdminAddress != defaultPlatformAdmin, "Admin address is invalid");

        defaultPlatformAdmin = _newDefaultAdminAddress;
    }    
    
    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165) returns (bool) {
        return
            interfaceId == type(INFTixLaunchpad).interfaceId ||
            super.supportsInterface(interfaceId);
    }
}