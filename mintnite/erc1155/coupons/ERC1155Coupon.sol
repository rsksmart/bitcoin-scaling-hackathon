// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Authorizable.sol";
import "@openzeppelin/contracts@4.9.2/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts@4.9.2/access/Ownable.sol";
import "@openzeppelin/contracts@4.9.2/security/Pausable.sol";
import "@openzeppelin/contracts@4.9.2/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts@4.9.2/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts@4.9.2/token/ERC1155/extensions/ERC1155URIStorage.sol";

contract ERC1155Coupon is ERC1155, Ownable, Authorizable, Pausable, ERC1155Burnable, ERC1155Supply, ERC1155URIStorage {
    
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

    function burn(address account, uint256 id, uint256 value) public override onlyAuthorized {
        _burn(account, id, value);
    }

    function safeTransferFrom(address from, address to, uint256 id, uint256 value, bytes memory data) public override onlyOwner {
        //address sender = _msgSender();
        //if (from != sender && !isApprovedForAll(from, sender)) {
            //revert ERC1155MissingApprovalForAll(sender, from);
        //}
        _safeTransferFrom(from, to, id, value, data);
    }
    
    function uri(uint256 _tokenid) override(ERC1155, ERC1155URIStorage) public view returns (string memory) {

        string memory baseURI = subString(ERC1155URIStorage.uri(_tokenid), 0, bytes(ERC1155URIStorage.uri(_tokenid)).length - 9);

        if (containText("{id}.json", ERC1155URIStorage.uri(_tokenid))) {
            return string(
                    abi.encodePacked(
                        baseURI,
                        Strings.toString(_tokenid),".json"
                    )
                );
        } else {
            return string(ERC1155URIStorage.uri(_tokenid));
        }
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
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

    // Batch mint tokens for multiple addresses with one token URI
    function mintOneToMany(address[] memory accounts, uint256 id, uint256 amount, bytes memory data, string memory tokenURI) public onlyAuthorized {
        uint i = 0;
        for(i; i < accounts.length; i++) {
            _mint(accounts[i], id, amount, data);
            ERC1155URIStorage._setURI(id, tokenURI);
        }
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

    function containText(string memory what, string memory where) internal pure returns (bool found){
        bytes memory whatBytes = bytes (what);
        bytes memory whereBytes = bytes (where);

        //require(whereBytes.length >= whatBytes.length);
        if(whereBytes.length < whatBytes.length){ return false; }

        found = false;
        for (uint i = 0; i <= whereBytes.length - whatBytes.length; i++) {
            bool flag = true;
            for (uint j = 0; j < whatBytes.length; j++)
                if (whereBytes [i + j] != whatBytes [j]) {
                    flag = false;
                    break;
                }
            if (flag) {
                found = true;
                break;
            }
        }
        return found;

    }

    function subString(string memory str, uint startIndex, uint endIndex) internal pure returns (string memory ) {
        bytes memory strBytes = bytes(str);
        bytes memory result = new bytes(endIndex-startIndex);
        for(uint i = startIndex; i < endIndex; i++) {
            result[i-startIndex] = strBytes[i];
        }
        return string(result);
    }
}
