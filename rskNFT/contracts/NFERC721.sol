/// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC2981Upgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

error CollectionSoldOut();
error MintPriceMustBeGreaterThanZero();
error RoyaltyFeeTooHigh();
error TotalSupplyMustBeGreaterThanZero();
error InvalidPaymentAddress();
error WithdrawPenaltyTimeTooHigh();
error WithdrawPenaltyPercentageTooHigh();
bytes constant BASE58_ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

/// RSK NFT ERC721 Contract
/// Development done for the Rootstock: Bitcoin Scaling Hackathon
contract NFERC721 is
    OwnableUpgradeable,
    ERC721Upgradeable
{
    event Withdraw(address indexed to, uint256 amount);    

    uint256 internal _mintPrice;
    bytes32 _baseURICIDHash;

    uint256 public totalAmountOfStakes;
    uint256 public totalStakedRaw;
    mapping(uint256 => uint256) public amountOfStakes;
    mapping(uint256 => uint256) public minimumMintFeeWhenMinting;
    mapping(uint256 => uint256) public stakedRaw;
    uint256 public rawPendingToWithdraw;
    mapping(address => uint256) public totalWithdrawn;
    mapping(uint256 => uint256) public mintingDate;

    address public erc20PaymentAddress;

    uint32 internal _soldTokens;
    uint16 public royaltyFee;
    uint16 public mintRoyaltyFee;
    uint16 public rewardsRoyaltyFee;
    uint32 public collectionSize;
    uint32 public burnedTokens;

    uint32 public withdrawPenaltyTime;
    uint16 public withdrawPenaltyPercentage;

    constructor() {
        _disableInitializers();
    }    

    /// @notice To be called to create the collection. Can only be called once.
    function initialize(
        string memory tokenName,
        string memory tokenSymbol,
        uint256 iMintPrice,
        address iErc20PaymentAddress,
        uint32[] calldata integers,
        bytes32 baseURICIDHash,
        address owner
    ) public initializer {
        __ERC721_init(tokenName, tokenSymbol);

        _transferOwnership(owner);

        _baseURICIDHash = baseURICIDHash;

        if (iErc20PaymentAddress == address(0)) revert InvalidPaymentAddress();
        erc20PaymentAddress = iErc20PaymentAddress;
        if (integers[4] > 365 days) revert WithdrawPenaltyTimeTooHigh();
        if (uint16(integers[5]) > 10_000) revert WithdrawPenaltyPercentageTooHigh();
        withdrawPenaltyTime = integers[4];
        withdrawPenaltyPercentage = uint16(integers[5]);

        if (integers[0] == 0) revert TotalSupplyMustBeGreaterThanZero();
        collectionSize = integers[0];

        if (uint16(integers[1]) > 10_00) revert RoyaltyFeeTooHigh();
        royaltyFee = uint16(integers[1]);

        if (uint16(integers[2]) > 10_00) revert RoyaltyFeeTooHigh();
        mintRoyaltyFee = uint16(integers[2]);

        if (uint16(integers[3]) > 10_00) revert RoyaltyFeeTooHigh();
        rewardsRoyaltyFee = uint16(integers[3]);

        if (iMintPrice == 0) revert MintPriceMustBeGreaterThanZero();
        _mintPrice = iMintPrice;

    }

    function exists(uint256 tokenId) public view returns (bool)
    {
        return _exists(tokenId);
    }

    function _mint(bool firstMinting, address to, uint256 tokenId, uint256 mintPricePerToken)
        internal
    {

        mintingDate[tokenId] = block.timestamp;

        uint ownerFee = (mintRoyaltyFee *  _mintPrice) / 100_00;
        uint mintPriceMinusFee = mintPricePerToken - ownerFee;

        minimumMintFeeWhenMinting[tokenId] = _mintPrice - ownerFee;

        rawPendingToWithdraw += ownerFee;

        uint totalAmountWithRewards = getTotalAmountWithRewards();

        uint currentTokenStakes;

        if (firstMinting || totalStakedRaw == 0 || totalAmountOfStakes == 0 || totalAmountWithRewards == 0) {

            totalAmountOfStakes = 0;
            totalStakedRaw = 0;
            currentTokenStakes = mintPriceMinusFee;
        } else {

            uint newTotalStakes = (totalAmountWithRewards + mintPriceMinusFee) * totalAmountOfStakes / totalAmountWithRewards;
            currentTokenStakes = newTotalStakes - totalAmountOfStakes;

        }

        totalAmountOfStakes += currentTokenStakes;
        totalStakedRaw += mintPriceMinusFee;

        amountOfStakes[tokenId] = currentTokenStakes;
        stakedRaw[tokenId] = mintPriceMinusFee;

        super._mint(to, tokenId);
    }

    function getBurnableAmount(uint256 tokenId) public view returns (uint256 amountToWithdraw) {
        require(_exists(tokenId), "ERC721: burn of nonexistent token");

        uint totalAmountStaked = getTotalAmountWithRewards();

        uint unburnedTokens = collectionSize - burnedTokens;

        uint relativeStakes = amountOfStakes[tokenId];

        if (unburnedTokens <= 1) {

            amountToWithdraw = totalAmountStaked;
        } else {

            amountToWithdraw = (relativeStakes * totalAmountStaked) / totalAmountOfStakes;

            uint unburnedPercentagePenalty = (unburnedTokens * 100_00) / collectionSize;
            assert(unburnedPercentagePenalty <= 100_00);

            uint penaltyPercentage = unburnedPercentagePenalty;

            uint elapsed = block.timestamp - mintingDate[tokenId];

            if (elapsed < withdrawPenaltyTime) {

                uint remainingTime = withdrawPenaltyTime - elapsed;
                uint remainingTimePercentagePenalty = (remainingTime * 100_00) / withdrawPenaltyTime;
                assert(remainingTimePercentagePenalty <= 100_00);

                penaltyPercentage += remainingTimePercentagePenalty;
            }

            assert(penaltyPercentage <= 200_00);

            uint256 penaltiesAmount = (minimumMintFeeWhenMinting[tokenId] * penaltyPercentage * withdrawPenaltyPercentage) / 100_00 / 100_00;
            if (penaltiesAmount > amountToWithdraw) return 0;
            amountToWithdraw -= penaltiesAmount;

        }
    }

    modifier onlyNFTOwner(uint256 tokenId) {
        require(msg.sender == ownerOf(tokenId), "ERC721: Caller must be owner");
        _;
    }

    function burnToWithdraw(uint256 tokenId) public onlyNFTOwner(tokenId) {

        uint amountToWithdraw = getBurnableAmount(tokenId);

        _burn(tokenId);
        burnedTokens++;

        totalAmountOfStakes -= amountOfStakes[tokenId];
        totalStakedRaw -= stakedRaw[tokenId];
        delete amountOfStakes[tokenId];
        delete stakedRaw[tokenId];

        _send(msg.sender, amountToWithdraw);
    }

    function withdrawPending() public onlyOwner {

        uint amountToWithdraw = rawPendingToWithdraw;
        /// Avoid reentrancy attacks from the owner itself taking funds from other users.
        rawPendingToWithdraw = 0;

        if (amountToWithdraw > 0) {
            _send(msg.sender, amountToWithdraw);
        } else {

            revert("No pending amount to withdraw");
        }
    }

    function getTotalAmountWithRewards() public view returns (uint256 amount) {
        amount = getContractStaked();

    }

    /// @notice Returns the total amount staked by the contract. Not including rewards.
    function getContractStaked() public view returns (uint256 amount) {
        return IERC20Upgradeable(erc20PaymentAddress).balanceOf(address(this)) - rawPendingToWithdraw;

    }

    function unstakeableAmount(uint256 tokenId) public view returns (uint256 unstakeable) {
        uint256 totalValueBefore = getTotalAmountWithRewards();
        (unstakeable, ) = _unstakeableAmountAux(tokenId, totalValueBefore);
    }

    function _unstakeableAmountAux(uint256 tokenId, uint256 totalValueBefore) private view returns (uint256 unstakeable, uint256 tokenValueBefore) {

        uint256 unburnedTokens = collectionSize - burnedTokens;

        if (unburnedTokens <= 1) {
            tokenValueBefore = totalValueBefore;
        } else {
            tokenValueBefore = (amountOfStakes[tokenId] * totalValueBefore) / totalAmountOfStakes;
        }

        if (tokenValueBefore > minimumMintFeeWhenMinting[tokenId]) {
            unstakeable = tokenValueBefore - minimumMintFeeWhenMinting[tokenId];
        }
    }

    function decreaseStaking(uint256 tokenId, uint256 amountToDecrease) onlyNFTOwner(tokenId) external {
        require(amountToDecrease > 0, "Decrease amount must be higher than 0");
        uint256 totalValueBefore = getTotalAmountWithRewards();
        (uint256 unstakeable, uint256 tokenValueBefore) = _unstakeableAmountAux(tokenId, totalValueBefore);

        require(amountToDecrease <= unstakeable, "Decrease amount is higher than unstakeable amount");

        uint256 totalValueAfter = totalValueBefore - amountToDecrease;

        uint256 tokenValueAfter = tokenValueBefore - amountToDecrease;
        assert(tokenValueAfter >= minimumMintFeeWhenMinting[tokenId]);

        if (tokenValueAfter < stakedRaw[tokenId]) {

            uint256 differenceOfStaked = stakedRaw[tokenId] - tokenValueAfter;
            stakedRaw[tokenId] = tokenValueAfter;
            totalStakedRaw -= differenceOfStaked;
        }

        uint256 newAmountOfStakes = (totalAmountOfStakes * totalValueAfter) / totalValueBefore;
        uint256 differenceOfStakes = totalAmountOfStakes - newAmountOfStakes;
        amountOfStakes[tokenId] -= differenceOfStakes;
        totalAmountOfStakes -= differenceOfStakes;

        _send(msg.sender, amountToDecrease);

    }

    function _send(address to, uint256 amount) private {
        SafeERC20Upgradeable.safeTransfer(IERC20Upgradeable(erc20PaymentAddress), to, amount);

        totalWithdrawn[to] += amount;
        emit Withdraw(to, amount);

    }

    function increaseStaking(uint256 tokenId, uint256 amountToIncrease) payable external {
        require(amountToIncrease > 0, "Increase amount must be higher than 0");
        require(_exists(tokenId), "ERC721: increase of nonexistent token");
        uint256 totalValueBefore = getTotalAmountWithRewards();
        _requirePayment(amountToIncrease, 1);

        stakedRaw[tokenId] += amountToIncrease;
        totalStakedRaw += amountToIncrease;

        uint256 totalValueAfter = totalValueBefore + amountToIncrease;
        uint256 newAmountOfStakes = (totalAmountOfStakes * totalValueAfter) / totalValueBefore;
        uint256 differenceOfStakes = newAmountOfStakes - totalAmountOfStakes;
        amountOfStakes[tokenId] += differenceOfStakes;
        totalAmountOfStakes += differenceOfStakes;

    }

    function mint(uint256 price) external payable {
        require(price >= _mintPrice, "Price lower than mintPrice");
        bool firstMint = _soldTokens <= burnedTokens;
        unchecked {
            if ((++_soldTokens) > collectionSize) revert CollectionSoldOut();
        }
        _mint(firstMint, msg.sender, _soldTokens, price);
        _requirePayment(price, 1);
    }

    /// @notice Mints `amount` NFTs to the caller (msg.sender). Requires `minting type` to be `sequential` and the `mintPrice` to be send (if `Native payment`) or approved (if `ERC-20` payment).
    /// @param amount The number of NFTs to mint
    function mint(uint256 amount, uint256 price) external payable {
        require(price >= _mintPrice, "price lower than mintPrice");
        _mintSequentialWithChecks(msg.sender, amount, price);
        _requirePayment(price, amount);
    }

    function _mintSequentialWithChecks(address to, uint256 amount, uint256 price) private {
        if ((_soldTokens + amount) > collectionSize) revert CollectionSoldOut();

        _mintSequential(to, amount, price);
    }

    function _mintSequential(address to, uint256 amount, uint256 price) internal virtual {
        for (uint256 i; i < amount; ) {
            bool firstMint = _soldTokens <= burnedTokens;
            unchecked {
                _mint(firstMint, to, ++_soldTokens, price);
                ++i;
            }
        }
    }

    /// @notice Returns the minting price of one NFT.
    /// @return Mint price for one NFT in native coin or ERC-20.
    function mintPrice() external view returns (uint256) {
        return _mintPrice;
    }

    /// @notice Returns the current total supply.
    /// @return Current total supply.
    function totalSupply() external view returns (uint256) {
        return _soldTokens;
    }

    function royaltyInfo(
        uint256, 
        uint256 salePrice
    ) external view virtual returns (address receiver, uint256 royaltyAmount) {
        return (address(this), uint256((salePrice * royaltyFee) / 100_00));
    }

    function _requirePayment(uint256 p_mintPrice, uint256 amount) internal {

        if (p_mintPrice == 0) return;
        uint256 totalAmount = p_mintPrice * amount;

        SafeERC20Upgradeable.safeTransferFrom(
            IERC20Upgradeable(erc20PaymentAddress),
            msg.sender,
            address(this),
            totalAmount
        );
    }

    function _base58Encode(bytes memory data_) private pure returns (bytes memory) {
        unchecked {
            uint256 size = data_.length;
            uint256 zeroCount;
            while (zeroCount < size && data_[zeroCount] == 0) {
                zeroCount++;
            }
            size = zeroCount + ((size - zeroCount) * 8351) / 6115 + 1;
            bytes memory slot = new bytes(size);
            uint32 carry;
            int256 m;
            int256 high = int256(size) - 1;
            for (uint256 i; i < data_.length; ++i) {
                m = int256(size - 1);
                for (carry = uint8(data_[i]); m > high || carry != 0; m--) {
                    carry = carry + 256 * uint8(slot[uint256(m)]);
                    slot[uint256(m)] = bytes1(uint8(carry % 58));
                    carry /= 58;
                }
                high = m;
            }
            uint256 n;
            for (n = zeroCount; n < size && slot[n] == 0; n++) {}
            size = slot.length - (n - zeroCount);
            bytes memory out = new bytes(size);
            for (uint256 i; i < size; ++i) {
                uint256 j = i + n - zeroCount;
                out[i] = BASE58_ALPHABET[uint8(slot[j])];
            }
            return out;
        }
    }

    /**
     * @notice encodeToString is used to encode the given byte in base58 standard.
     * @param data_ raw data, passed in as bytes.
     * @return base58 encoded data_, returned as a string.
     */
    function _base58EncodeToString(bytes memory data_) private pure returns (string memory)
    {
        return string(_base58Encode(data_));
    }

    function _getIPFSURI(bytes32 CIDHash) internal pure returns (string memory) {
        return string(abi.encodePacked("ipfs://", _getCIDFromHash(CIDHash)));
    }

    function _getCIDFromHash(bytes32 inputHash)
        private
        pure
        returns (string memory)
    {

        return
            string(
                _base58EncodeToString(
                    abi.encodePacked(bytes2(0x1220), inputHash)
                )
            );
    }

    function tokenURIImpl(uint256 tokenId) external view returns (string memory) {
            string memory baseURI = _getIPFSURI(_baseURICIDHash);
            return
                string(
                    abi.encodePacked(
                        baseURI,
                        "/",
                        Strings.toString(tokenId),
                        ".json"
                    )
                );
    }

    function finVersion() virtual external pure returns (uint256) {
        return 2001;
    }

    function totalPendingToWithdraw(address user) external view returns (uint256, bool) {
        if (user == owner()) return (rawPendingToWithdraw, true);
        return (0, true);
    }

}

