// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts@4.9.2/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts@4.9.2/access/Ownable.sol";
import "@openzeppelin/contracts@4.9.2/security/Pausable.sol";
import "@openzeppelin/contracts@4.9.2/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts@4.9.2/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts@4.9.2/token/ERC1155/extensions/ERC1155URIStorage.sol";

contract ERC1155ST is ERC1155, Ownable, Pausable, ERC1155Burnable, ERC1155Supply, ERC1155URIStorage {
    
    // Contract name
    string public name;

    // Contract symbol
    string public symbol;

    constructor(string memory contractName, string memory contractSymbol, string memory contractURI)
        public
        ERC1155(contractURI)
    {
        name = contractName;
        symbol = contractSymbol;
    }

    function uri(uint256 tokenId) public view override(ERC1155, ERC1155URIStorage) returns (string memory) {
        return ERC1155URIStorage.uri(tokenId);
    }

    function setTokenURI(uint256 tokenId, string memory tokenURI) public onlyOwner {
        ERC1155URIStorage._setURI(tokenId, tokenURI);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mintWithTokenURI(address account, uint256 id, uint256 amount, bytes memory data, string memory tokenURI)
        public
        onlyOwner
    {
        _mint(account, id, amount, data);
        ERC1155URIStorage._setURI(id, tokenURI);
    }

    function mint(address account, uint256 id, uint256 amount, bytes memory data)
        public
        onlyOwner
    {
        _mint(account, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
    {
        _mintBatch(to, ids, amounts, data);
    }

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        whenNotPaused
        override(ERC1155, ERC1155Supply)
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
