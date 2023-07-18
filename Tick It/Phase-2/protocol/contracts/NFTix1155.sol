//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "hardhat/console.sol";


/// @notice ERC1155
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

/// @notice peripheral
/// @notice Address contract library
import "@openzeppelin/contracts/utils/Address.sol";
/// @notice AccessControl contract pattern
import "@openzeppelin/contracts/access/AccessControl.sol";
/// @notice Pausable Contract pattern
import "@openzeppelin/contracts/security/Pausable.sol";
/// @notice is the Counters Upgradeable contract used for defining the tokenId for each event
import "@openzeppelin/contracts/utils/Counters.sol";


contract NFTix1155 is ERC1155, Pausable {

    using Counters for Counters.Counter;
    Counters.Counter private tokenIdCounter = Counters.Counter(1);

    /// @notice Create event to be emitted upon creating an event or nft 721 deployment
    event CreateEvent(
        uint256 indexed tokenId,
        address contractAddress
    );

    /// @notice Attend event to be emitted upon attending an event or scanning a qr code
    event AttendEvent(
        uint256 indexed tokenId,
        address contractAddress,
        address userAddress
    );

    /// @notice Zero Address Error
    error ZeroAddress();
    /// @notice If the contract is the base contract then it should fail
    error BaseContract();
    /// @notice if the base uri is invalid
    error InvalidBaseURI();
    /// @notice Invalid address if the address is a zero address or a wrong one
    error InvalidAddress();
    /// @notice Transaction Fallback Disabled
    error FallbackDisabled();

    /// This is a Uniform Resource Identifier, distinct used to identify each unique nft from the other.
    string private _baseTokenURI;
    /// @notice Is Base Contract flag
    bool public isBase;
    /// @notice address owner
    address public owner;


    /// Mappings
    // Event Token Mapping represents the mapping of each event address to the tokenID is will be minted to 
    mapping(address => uint256) public eventTokenId;
    // A mapping by event and user address which shows if the user has attented 
    mapping(address => mapping(uint256 => bool)) public userAttended;

    /// @notice only owner modifier
    modifier onlyOwner() {
        require(msg.sender == owner, "NFTix1155: only owner");
        _;
    }


    /**
     * @notice constructor
     * @param uri_ is the the uri of the IPFS image
     * @param owner_ is the owner of the contract
     **/
    constructor(string memory uri_, address owner_) ERC1155(uri_){
        require(
            isBase == false,
            "NFTix1155: this is the base contract,cannot initialize"
        );

        require(
            owner == address(0),
            "NFTixT1155: contract already initialized"
        );
        owner = owner_;
    }

    /// @notice pauses the contract (minting and transfers)
    function pause() external virtual onlyOwner {
        _pause();
    }

    /// @notice unpauses the contract (minting and transfers)
    function unpause() external virtual onlyOwner {
        _unpause();
    }

    /// @notice disabling fallback recieve
    receive() external payable {
        revert FallbackDisabled();
    }

    fallback() external payable {
        revert FallbackDisabled();
    }

    /**
     * @notice this function will create a event by tokenId and when the user scans for attending the event a new NFT will be minted to his/her address
     * @param contractAddress is the erc721 contract address related to the event and is used for the mapping of tokenId to event 
     */
    function createEvent(address contractAddress) external {
        // This require is to make sure that the event does not have a tokenId registered already
        require(eventTokenId[contractAddress] == 0, "Event already exists");

        // This is the tokenId that will be set for the contract address
        uint256 contractTokenId = tokenIdCounter.current();
        tokenIdCounter.increment();
        eventTokenId[contractAddress] = contractTokenId;

        emit CreateEvent(contractTokenId, contractAddress);
    }

    /**
     * This function will mint an NFT that represents a certain event whereby each user that attends will receive a NFT
     * @param contractAddress is the contract address that represents the event where the user will be attending
     * @param to is the address the nft will be minted to when he/she attend the event
     */
    function attendEvent(address contractAddress, address to) external {
        // This require is to make sure that the event does not have a tokenId registered already
        require(eventTokenId[contractAddress] != 0, "Event does not exist");        
        uint256 tokenId = eventTokenId[contractAddress];
        require(balanceOf(to, tokenId) == 0, "User Already Registered in the Event");
        _mint(to, tokenId, 1, "");

        emit AttendEvent(tokenId, contractAddress, to);
    }

    /**
     * This function will return true or false based on if the user attented the event or not
     * @param contractAddress is the address of the contract used to identify the tokenId related to the event
     * @param user is the address of the user used to identify if this address is an owner of a certain tokenId
     */
    function userAttend(address contractAddress, address user) external view returns(bool){
        // This require is to make sure that the event does not have a tokenId registered already
        require(eventTokenId[contractAddress] != 0, "Event does not exist");
        uint256 tokenId = eventTokenId[contractAddress];

        if(balanceOf(user, tokenId) == 1){
            return true;
        } else {
            return false;
        }
    }

    /**
     * @notice setting token URI
     * @param uri_ new URI
     */
    function setURI(string memory uri_) external onlyOwner {
        require(
            keccak256(abi.encodePacked(super.uri(0))) !=
                keccak256(abi.encodePacked(uri_)),
            "ERROR: URI same as previous"
        );
        _setURI(uri_);
    }

}