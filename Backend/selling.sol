pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract NFTMarketplace is ERC721 {
    using Address for address payable;

    struct Listing {
        address seller;
        uint256 price;
        bool active;
    }

    mapping(uint256 => Listing) public listings;

    event NFTListed(uint256 tokenId, address seller, uint256 price);
    event NFTSold(uint256 tokenId, address seller, address buyer, uint256 price);

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {}

    function listNFT(uint256 tokenId, uint256 price) external {
        require(ownerOf(tokenId) == msg.sender, "You don't own this NFT");
        require(price > 0, "Price should be greater than zero");

        listings[tokenId] = Listing(msg.sender, price, true);

        emit NFTListed(tokenId, msg.sender, price);
    }

    function buyNFT(uint256 tokenId) external payable {
        require(_exists(tokenId), "NFT does not exist");
        require(listings[tokenId].active, "NFT is not listed for sale");
        require(msg.value >= listings[tokenId].price, "Insufficient payment");

        address payable seller = payable(listings[tokenId].seller);
        uint256 price = listings[tokenId].price;

        delete listings[tokenId];
        _transfer(seller, msg.sender, tokenId);

        seller.safeTransferETH(price); // Transfer payment to the seller

        emit NFTSold(tokenId, seller, msg.sender, price);
    }
}
