// SPDX-License-Identifier: MIT
// The difference between this contract and the standard ERC721 is contract owner and other 
// authorized accounts can burn anyone's tokens for the sake of coupon redemption.
pragma solidity ^0.8.9;

import "./Authorizable.sol";
import "@openzeppelin/contracts@4.9.0/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.9.0/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts@4.9.0/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts@4.9.0/access/Ownable.sol";
import "@openzeppelin/contracts@4.9.0/utils/Counters.sol";

contract ERC721AccessControl is ERC721, ERC721URIStorage, ERC721Burnable, Ownable, Authorizable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor(string memory myName, string memory mySymbol)
        public
        ERC721(myName, mySymbol)
    {}

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // Mint bulk NFTs for multiple addresses with one token URIs
    function safeMintOneToMany(address[] memory tos, string memory uri) public onlyOwner {
        uint i = 0;
        for(i; i < tos.length; i++) {
            uint256 tokenId = _tokenIdCounter.current();
            _tokenIdCounter.increment();
            _safeMint(tos[i], tokenId);
            _setTokenURI(tokenId, uri);
        }
    }

    // Mint bulk NFTs for multiple addresses with multiple token URIs
    function safeMintManyToMany(address[] memory tos, string[] memory uris) public onlyOwner {
        uint i = 0;
        for(i; i < tos.length; i++) {
            uint256 tokenId = _tokenIdCounter.current();
            _tokenIdCounter.increment();
            _safeMint(tos[i], tokenId);
            _setTokenURI(tokenId, uris[i]);
        }
    }

    // Only allow contract owner or authorized account to burn tokens
    function burn(uint256 tokenId) public onlyAuthorized override virtual {
        _burn(tokenId);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
