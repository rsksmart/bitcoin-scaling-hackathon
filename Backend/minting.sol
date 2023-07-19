pragma solidity ^0.8.0;
//npm install @rootstack/web3deploy

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTContract is ERC721 {
    constructor() ERC721("MyNFT", "MNFT") {}

    function mintNFT(address to, uint256 tokenId) external {
        _safeMint(to, tokenId);
    }
}
