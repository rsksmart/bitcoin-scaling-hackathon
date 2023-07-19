/** ---------------------------------------------------------------------------- //
 *                                                                               //
 *                                       .:::.                                   //
 *                                    .:::::::.                                  //
 *                                    ::::::::.                                  //
 *                                 .:::::::::.                                   //
 *                             ..:::.              ..                            //
 *                          .::::.                 ::::..                        //
 *                      ..:::..                    ::::::::.                     //
 *                   .::::.                        :::.  ..:::.                  //
 *               ..:::..                           :::.      .:::.               //
 *            .::::.                               :::.         .:::..           //
 *         .:::..               ..                 :::.            .::::.        //
 *     .::::.               ..:::=-                ::::               ..:::.     //
 *    :::.               .:::::::===:              ::::::.               .::::   //
 *   .::.            .:::::::::::=====.            ::::::::::.             .::.  //
 *   .::         .:::::::::::::::=======.          :::::::::::::..          ::.  //
 *   .::        .::::::::::::::::========-         :::::::::::::::::        ::.  //
 *   .::        .::::::::::::::::==========:       :::::::::::::::::        ::.  //
 *   .::        .::::::::::::::::============:     :::::::::::::::::        ::.  //
 *   .::        .::::::::::::::::==============.   :::::::::::::::::        ::.  //
 *   .::        .::::::::::::::::===============-. :::::::::::::::::        ::.  //
 *   .::        .::::::::::::::::=================::::::::::::::::::        ::.  //
 *   .::        .::::::::::::::::==================-::::::::::::::::        ::.  //
 *   .::        .::::::::::::::::==================-::::::::::::::::        ::.  //
 *   .::        .::::::::::::::::==================-::::::::::::::::        ::.  //
 *   .::        .:::::::::::::::::=================-::::::::::::::::        ::.  //
 *   .::        .:::::::::::::::: .-===============-::::::::::::::::        ::.  //
 *   .::        .::::::::::::::::   .==============-::::::::::::::::        ::.  //
 *   .::        .::::::::::::::::     :============-::::::::::::::::        ::.  //
 *   .::        .::::::::::::::::       :==========-::::::::::::::::        ::.  //
 *   .::        .::::::::::::::::        .-========-::::::::::::::::        ::.  //
 *   .::          .::::::::::::::          .=======-::::::::::::::.         ::.  //
 *   .::.             .::::::::::            .=====-::::::::::..            ::.  //
 *    :::..              ..::::::              :===-::::::..              .:::.  //
 *      .:::..               .:::                -=-:::.               .::::.    //
 *         .::::.            .:::                 ..                .::::.       //
 *            .::::.         .:::                               ..:::.           //
 *                .:::.      .:::                            .::::.              //
 *                   .:::..  .:::                        ..:::..                 //
 *                      .::::.:::                     .::::.                     //
 *                         ..::::                 ..:::..                        //
 *                             .:              .::::.                            //
 *                                     :::::.::::.                               //
 *                                    ::::::::.                                  //
 *                                    :::::::.                                   //
 *                                     .::::.                                    //
 *                                                                               //
 *                                                                               //
 *   Smart contract generated by https://nfts2me.com                             //
 *                                                                               //
 *   NFTs2Me. Make an NFT Collection.                                            //
 *   With ZERO Coding Skills.                                                    //
 *                                                                               //
 *   NFTs2Me is not associated or affiliated with this project.                  //
 *   NFTs2Me is not liable for any bugs or issues associated with this contract. //
 *   NFTs2Me Terms of Service: https://nfts2me.com/terms-of-service/             //
 * ----------------------------------------------------------------------------- */

/// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/EIP712Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721VotesUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./N2MTokenCommon.sol";

/// @title NFTs2Me.com Smart Contracts for ERC-721.
/// @author The NFTs2Me Team
/// @notice Read our terms of service
/// @custom:security-contact security@nfts2me.com
/// @custom:terms-of-service https://nfts2me.com/terms-of-service/
/// @custom:website https://nfts2me.com/
contract N2MERC721 is
    N2MTokenCommon,
    ERC721Upgradeable,
    EIP712Upgradeable,
    ERC721VotesUpgradeable
{

    /// @notice To be called to create the collection. Can only be called once.
    function initialize(
        string memory tokenName,
        string memory tokenSymbol,
        uint256 iMintPrice,
        bytes32 baseURICIDHash,
        bytes32 placeholderImageCIDHash,
        RevenueAddress[] calldata revenueAddresses,
        address iErc20PaymentAddress,
        uint32 iTotalSupply,
        uint16 iRoyaltyFee,
        bool soulboundCollection,
        MintingType iMintingType
    ) public payable override initializer {
        __ERC721_init(tokenName, tokenSymbol);

        if (iTotalSupply == 0) revert TotalSupplyMustBeGreaterThanZero();
        if (baseURICIDHash != 0 && placeholderImageCIDHash != 0) revert CantSetBaseURIAndPlaceholderAtTheSameTime();
        if (iRoyaltyFee > 50_00) revert RoyaltyFeeTooHigh();

        _collectionSize = iTotalSupply;
        if (baseURICIDHash == 0) {
            if (placeholderImageCIDHash == 0) {
                if (iMintingType != MintingType.CUSTOM_URI)
                    revert NoBaseURINorPlaceholderSet();
            } else {
                _placeholderImageCIDHash = placeholderImageCIDHash;
            }
        } else {
            _baseURICIDHash = baseURICIDHash;
        }

        _mintPrice = iMintPrice;
        _royaltyFee = iRoyaltyFee;
        if (iMintingType != MintingType.SEQUENTIAL) {
            _mintingType = iMintingType;
        }
        if (iErc20PaymentAddress != address(0)) {
            _isERC20Payment = true;
            _erc20PaymentAddress = iErc20PaymentAddress;
        }
        if (soulboundCollection == true) {
            _soulboundCollection = true;
        }

        if (revenueAddresses.length > 0) {
            uint256 revenuePercentageTotal;
            for (uint256 i; i < revenueAddresses.length; ) {
                revenuePercentageTotal += revenueAddresses[i].percentage;
                unchecked {
                    ++i;
                }
            }
            _revenueInfo = revenueAddresses;
            if (revenuePercentageTotal > 100_00 - N2M_FEE) revert InvalidRevenuePercentage();
        }

    }

    constructor(address libraryAddress, address payable factoryAddress) N2MTokenCommon(libraryAddress, factoryAddress) {}

    /// @notice A distinct Uniform Resource Identifier (URI) for a given asset.
    /// @dev Throws if `_tokenId` is not a valid NFT. URIs are defined in RFC
    ///  3986. The URI may point to a JSON file that conforms to the "ERC721
    ///  Metadata JSON Schema".
    function tokenURI(uint256 tokenId)
        public
        view
        override(N2MTokenCommon, ERC721Upgradeable)
        returns (string memory)
    {
        _requireMinted(tokenId);
        return IN2MLibrary(address(this)).tokenURIImpl(tokenId);
    }

    function _exists(uint256 tokenId)
        internal
        view
        override(ERC721Upgradeable, N2MTokenCommon)
        returns (bool)
    {
        return super._exists(tokenId);
    }

    function _mint(address to, uint256 tokenId)
        internal
        override(ERC721Upgradeable, N2MTokenCommon)
    {
        super._mint(to, tokenId);
    }

    /// @notice A descriptive name for a collection of NFTs in this contract
    function name()
        public
        view
        override(ERC721Upgradeable, N2MTokenCommon)
        returns (string memory)
    {
        return super.name();
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal override {
        if (
            from != address(0) &&
            (_soulbound[firstTokenId] || _soulboundCollection)
        ) revert NonTransferrableSoulboundNFT();

        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    }

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal override(ERC721Upgradeable, ERC721VotesUpgradeable) {
        super._afterTokenTransfer(from, to, firstTokenId, batchSize);

        if (_maxPerAddress != 0) {

            if (balanceOf(to) > _maxPerAddress) revert MaxPerAddressExceeded();
        }
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721Upgradeable)
    {
        super._burn(tokenId);
        if (_customURICIDHashes[tokenId] != 0) {
            delete _customURICIDHashes[tokenId];
        }        
    }

    /// @notice Query if a contract implements an interface
    /// @param interfaceId The interface identifier, as specified in ERC-165
    /// @dev Interface identification is specified in ERC-165. This function uses less than 30,000 gas.
    /// @return `true` if the contract implements `interfaceId` and `interfaceId` is not 0xffffffff, `false` otherwise
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, IERC165Upgradeable)
        returns (bool)
    {
        return (

        interfaceId == type(IERC2981Upgradeable).interfaceId || super.supportsInterface(interfaceId));
    }

    /// @notice An abbreviated name for NFTs in this contract
    /// @return the collection symbol
    function symbol()
        public
        view
        virtual
        override(IN2M_ERCBase, ERC721Upgradeable)
        returns (string memory)
    {
        return super.symbol();
    }

    /// @notice Count all NFTs assigned to an owner
    /// @dev NFTs assigned to the zero address are considered invalid, and this
    ///  function throws for queries about the zero address.
    /// @param owner An address for whom to query the balance
    /// @return balance The number of NFTs owned by `owner`, possibly zero
    function balanceOf(address owner) public view override(ERC721Upgradeable, N2MTokenCommon) returns (uint256 balance) {
        balance = super.balanceOf(owner);
        if (_mintingType == MintingType.RANDOM) {
            balance += _randomTickets[owner].amount;
        }
    }

    function _EIP712Name() internal virtual override view returns (string memory) {
        return "NFTs2Me";
    }

    function _EIP712Version() internal virtual override view returns (string memory) {
        return "1";
    }

    /// @notice Enable or disable approval for a third party ("operator") to manage
    ///  all of `msg.sender`'s assets
    /// @dev Emits the ApprovalForAll event. The contract MUST allow
    ///  multiple operators per owner.
    /// @param operator Address to add to the set of authorized operators
    /// @param approved True if the operator is approved, false to revoke approval
    function setApprovalForAll(address operator, bool approved) public override onlyAllowedOperatorApproval(operator) {
        super.setApprovalForAll(operator, approved);
    }

    /// @notice Change or reaffirm the approved address for an NFT
    /// @dev The zero address indicates there is no approved address.
    ///  Throws unless `msg.sender` is the current NFT owner, or an authorized
    ///  operator of the current owner.
    /// @param operator The new approved NFT controller
    /// @param tokenId The NFT to approve
    function approve(address operator, uint256 tokenId) public override onlyAllowedOperatorApproval(operator) {
        super.approve(operator, tokenId);
    }

    /// @notice Query if an address is an authorized operator for another address
    /// @param owner The address that owns the NFTs
    /// @param operator The address that acts on behalf of the owner
    /// @return True if `operator` is an approved operator for `owner`, false otherwise
    function isApprovedForAll(address owner, address operator)
    public
    view
    virtual
    override
    returns (bool)
    {

        if (operator == N2M_CONDUIT) return true;
        if (operator == OPENSEA_CONDUIT) return true;

        return super.isApprovedForAll(owner, operator);
    }

    /// @notice Transfer ownership of an NFT -- THE CALLER IS RESPONSIBLE
    ///  TO CONFIRM THAT `to` IS CAPABLE OF RECEIVING NFTS OR ELSE
    ///  THEY MAY BE PERMANENTLY LOST
    /// @dev Throws unless `msg.sender` is the current owner, an authorized
    ///  operator, or the approved address for this NFT. Throws if `from` is
    ///  not the current owner. Throws if `to` is the zero address. Throws if
    ///  `tokenId` is not a valid NFT.
    /// @param from The current owner of the NFT
    /// @param to The new owner
    /// @param tokenId The NFT to transfer
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override onlyAllowedOperator() {
        super.transferFrom(from, to, tokenId);
    }

    /// @notice Transfers the ownership of an NFT from one address to another address
    /// @dev This works identically to the other function with an extra data parameter,
    ///  except this function just sets data to "".
    /// @param from The current owner of the NFT
    /// @param to The new owner
    /// @param tokenId The NFT to transfer
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override onlyAllowedOperator() {
        super.safeTransferFrom(from, to, tokenId);
    }

    /// @notice Transfers the ownership of an NFT from one address to another address
    /// @dev Throws unless `msg.sender` is the current owner, an authorized
    ///  operator, or the approved address for this NFT. Throws if `from` is
    ///  not the current owner. Throws if `to` is the zero address. Throws if
    ///  `tokenId` is not a valid NFT. When transfer is complete, this function
    ///  checks if `to` is a smart contract (code size > 0). If so, it calls
    ///  `onERC721Received` on `to` and throws if the return value is not
    ///  `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`.
    /// @param from The current owner of the NFT
    /// @param to The new owner
    /// @param tokenId The NFT to transfer
    /// @param data Additional data with no specified format, sent in call to `to`
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public override onlyAllowedOperator() {
        super.safeTransferFrom(from, to, tokenId, data);
    }

}
