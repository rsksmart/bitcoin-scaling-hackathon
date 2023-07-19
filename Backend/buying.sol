pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTMarketplace is ERC721 {
    struct Bid {
        address bidder;
        uint256 amount;
    }

    mapping(uint256 => Bid) public bids;

    event BidPlaced(uint256 tokenId, address bidder, uint256 amount);
    event BidWithdrawn(uint256 tokenId, address bidder, uint256 amount);
    event BidAccepted(uint256 tokenId, address bidder, uint256 amount);
    event NFTPurchased(uint256 tokenId, address buyer, uint256 amount);

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {}

    function placeBid(uint256 tokenId) external payable {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        require(msg.value > bids[tokenId].amount, "Bid amount should be higher");

        if (bids[tokenId].bidder != address(0)) {
            // Return the previous bidder's funds
            payable(bids[tokenId].bidder).transfer(bids[tokenId].amount);
        }

        bids[tokenId] = Bid(msg.sender, msg.value);
        emit BidPlaced(tokenId, msg.sender, msg.value);
    }

    function withdrawBid(uint256 tokenId) external {
        require(bids[tokenId].bidder == msg.sender, "You haven't placed a bid");

        uint256 bidAmount = bids[tokenId].amount;
        delete bids[tokenId];
        payable(msg.sender).transfer(bidAmount);
        emit BidWithdrawn(tokenId, msg.sender, bidAmount);
    }

    function acceptBid(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Only token owner can accept bids");

        address bidder = bids[tokenId].bidder;
        uint256 bidAmount = bids[tokenId].amount;

        delete bids[tokenId];
        _safeTransfer(msg.sender, bidder, tokenId, "");

        emit BidAccepted(tokenId, bidder, bidAmount);
    }

    function buyNFT(uint256 tokenId) external payable {
        address tokenOwner = ownerOf(tokenId);
        require(tokenOwner != address(0), "Token does not exist");
        require(msg.value > 0, "Invalid payment amount");

        address payable seller = payable(tokenOwner);
        seller.transfer(msg.value);
        _safeTransfer(seller, msg.sender, tokenId, "");

        emit NFTPurchased(tokenId, msg.sender, msg.value);
    }
}
