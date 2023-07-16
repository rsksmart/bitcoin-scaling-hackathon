// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15 ; 

import "@openzeppelin/contracts/access/Ownable.sol" ; 
import "@openzeppelin/contracts/token/ERC721/ERC721.sol"; 
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Votes.sol";

contract DynamicNft is ERC721, Ownable {
    string public tokenUri;
    uint256 public s_tokenCounter;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _tokenUri
    ) ERC721(_name, _symbol) {
        tokenUri = _tokenUri;
    }

    // can be made onlyOwner
    function mintNft() public returns (uint256) {
        _safeMint(msg.sender, s_tokenCounter);
        s_tokenCounter += 1;
        return s_tokenCounter;
    }

    function changeTokenUri(string memory newTokenUri) public onlyOwner {
        tokenUri = newTokenUri;
    }

}
