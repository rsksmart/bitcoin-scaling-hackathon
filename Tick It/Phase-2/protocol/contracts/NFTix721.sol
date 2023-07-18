//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

/// @notice Payment Splitter
import "./launchpad/PaymentSplitter.sol";
/// @notice ERC721
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
/// @notice peripheral
/// @notice Initializable pattern for clonable contract
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
/// @notice Address contract library
import "@openzeppelin/contracts/utils/Address.sol";
/// @notice AccessControl contract pattern
import "@openzeppelin/contracts/access/AccessControl.sol";
/// @notice Pausable Contract pattern
import "@openzeppelin/contracts/security/Pausable.sol";
/// @notice libraries
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract NFTix721 is 
    Initializable, 
    ERC721, 
    Pausable, 
    PaymentSplitter
{
    /// @notice using Address for addresses extended functionality
    using Address for address;

    /// @notice using MerkleProof library to verify Merkle proofs
    using MerkleProof for bytes32[];

    /// @notice Enum representing the minting phases
    enum Phase {
        Presale, 
        Public
    }

    /// @notice Struct of the ticket with its properties
    struct TicketType {
        uint256 ticketCount;
        uint256 startTokenId;
        uint256 endTokenId;
        uint256 price;
        uint256 currentTokenId;
    }

    /// @notice Struct of the ticket minted and its properties
    struct Ticket {
        uint256 ticketType;
        uint256 tokenId;
    }

     /// @notice Admin mint event to be emitted when an Admin mints
    event AdminMint(
        address indexed to,
        uint256[] ticketTypeCounts
    );

    /// @notice Mint event to be emitted upon NFT mint by any user
    event UserMint(
        address indexed to,
        uint256[] ticketTypeCounts
    );

    /// @notice Phase change event to emitted when the phase is changed
    event PhaseChange(
        Phase phase, 
        uint256[] mintPrice, 
        uint256 mintingLimit
    );

    /// @notice Transaction Fallback Disabled
    error FallbackDisabled();

    /// @notice the current phase of the minting 
    Phase private _phase;

    /// This is a Uniform Resource Identifier, distinct used to identify each unique nft from the other.
    string private _baseTokenURI;
    /// @notice root of the new Merkle tree used for verification
    bytes32 private _merkleRoot;
    /// @notice Max number of NFTs to be minted
    uint256 private _maxTokenId;
    /// @notice the boolean variable to know whether the funds can be released or not
    bool private isReleased = false;
    /// @notice the boolean variable which determines if the there is a minting limit or not
    bool private useMintingLimit = true;
    /// @notice Token name
    string private _name;
    /// @notice Token symbol
    string private _symbol;
    /// @notice max amount of nfts that can be minted per wallet address
    uint32 public mintingLimit;
    /// @notice The array of ranges
    uint256[] public tokenRanges;
    ///@notice Max token supply
    uint256 public maxId;
    /// @notice Is Base Contract flag
    bool public isBase;
    /// @notice total supply of tokens being minted will be incremented and when burned will be decremented
    uint64 public totalSupply = 0;
    /// @notice the address of the admin for the platform
    address public ticketPlatformAdmin; 
    /// @notice address owner
    address public owner;


    /// @notice indicates the amount of mints per user per type
    mapping(uint256 => mapping(address => uint256)) public mintsPerUserPerType;

    /// @notice indicates the amount of mints per user
    mapping(address => uint256) public mintsPerUser;

    /// @notice the tickets being minted are maped bu tokenId
    mapping(uint256 => Ticket) private _tickets;

    /// @notice this is an array of ticket Types
    TicketType[] public ticketTypes;

    /**
     * @notice modifier for the platform admin only 
     */
    modifier onlyTicketPlatformAdmin() {
        require(msg.sender == ticketPlatformAdmin, "Caller is not the admin");
        _;
    }

    /// @notice only owner modifier
    modifier onlyOwner() {
        require(msg.sender == owner, "OasisXNFT1155: only owner");
        _;
    }

    /**
     * @notice constructor
     * @param isBase_ is the boolean that defines if it is the base contract
     * @param name_ is the name_ of the base contract
     * @param symbol_ is the symbol of the main contract
     **/
    constructor(
        bool isBase_, 
        string memory name_, 
        string memory symbol_
    ) ERC721(name_, symbol_) {
        isBase = isBase_;
        _name=name_;
        _symbol=symbol_;
    }

    /**
     * @notice Initialize Function
     * @param name_ the token name
     * @param symbol_ the token symbol
     * @param uri_ token metadata URI
     * @param ticketPrices_ is the array sent by the owner which determines the token prices for each type
     * @param ticketRanges_ is the array sent by the owner which determines the token Ids for each type
     * @param payees_ is the array of addresses that will receive payments from those sales
     * @param shares_ is the number of shares each address will receive
     * @param defaultPlatformAdmin is the admin responsible for function calls
     * @param owner_ is the owner of the contract usually the msg.sender
     * @param mintingLimit_ is the minting limit per user
     * @param root_ is the root of the merkle tree used for verification
     */
    function initialize( 
        string memory name_,
        string memory symbol_,
        string memory uri_,
        uint256[] memory ticketPrices_,
        uint256[] memory ticketRanges_,
        address[] memory payees_,
        uint256[] memory shares_,
        address defaultPlatformAdmin,
        address owner_,
        uint32 mintingLimit_,
        bytes32 root_
    ) external initializer {

        require(!isBase, "This is a base contract");

        require(defaultPlatformAdmin != address(0), "ZeroAddress");

        // Checks if the minting limit is negative or greater than the max supply
        require(!(mintingLimit_ > ticketRanges_[ticketRanges_.length - 1] || mintingLimit_ < 0), "MintLimitInvalid");

        ticketPlatformAdmin = defaultPlatformAdmin;

        _name = name_;
        _symbol = symbol_;

        initializePaymentSplitter(payees_, shares_);

        require(ticketPrices_.length == ticketRanges_.length, "Price and Range array mismatch");

        require(ticketPrices_.length > 0 && ticketRanges_.length > 0 && ticketPrices_.length <= 256 && ticketRanges_.length <= 256, "The prices and range arrays are invalid");

        uint256 startTokenId = 0;
        uint256 endTokenId = 0;

        for(uint256 i = 0; i<ticketPrices_.length; i++) {
            uint256 ticketRange = ticketRanges_[i];
            require(ticketRange > 0, "TicketCountInvalid");

            startTokenId = endTokenId + 1;
            endTokenId = ticketRange;

            uint256 price = ticketPrices_[i];
            require(price >= 0, "TicketPricesInvalid");

            ticketTypes.push(
                TicketType({
                    ticketCount: endTokenId - startTokenId + 1,
                    startTokenId: startTokenId,
                    endTokenId: endTokenId,
                    price: price,
                    currentTokenId: startTokenId
                })
            );
        }
        tokenRanges = ticketRanges_;
        _merkleRoot = root_;
        owner=owner_;
        if(mintingLimit_ == 0) {useMintingLimit = false;}
        mintingLimit = mintingLimit_;
        _baseTokenURI = uri_;

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
    receive() override external payable {
        revert FallbackDisabled();
    }

    fallback() external payable {
        revert FallbackDisabled();
    }

    /**
     * @notice mint function allows the user with access to mint the nft token
     * @param to is the address the NFT token will be transferred to
     * @param ticketTypeCounts is the amount of NFTs the user will mint
     * @param _proof is the proof sent to verify if the user is in the whitelist to get the NFT
     */
    function mint(address to, bytes32[] memory _proof, uint256[] memory ticketTypeCounts)
        external
        payable
        whenNotPaused
    {
        uint256 received = msg.value;

        require(to != address(0), "InvalidAddress");

        require(ticketTypeCounts.length == ticketTypes.length, "Ticket type count parameter does not have correct length");

        // if(_phase == Phase.Presale){
        //     isAllowedToMint(_proof);
        // }

        uint256 totalTickets = 0;
        uint256 totalPrice = 0;
        for(uint256 i = 0; i < ticketTypeCounts.length; i++) {
            uint256 ticketTypeCount = ticketTypeCounts[i];

            require(ticketTypeCount <= ticketTypes[i].endTokenId - ticketTypes[i].startTokenId, "MaxTokenExceeded");

            totalTickets += ticketTypeCount;
            totalPrice += ticketTypeCount * ticketTypes[i].price;
            // Check if for each type if there are any tokenIDs left for the user to mint
        }

        require(received == totalPrice, "Eth amount mismatch");

        // If the useMintingLimit is true then check for the amount of mints and throw an error if the user is not allowed to mint anymore
        if(useMintingLimit){
            checkUserLimit(to, totalTickets);
        }

        // Should be made sure of before the for loop of the mint
        checkMaxSupplyPerTicketType(ticketTypeCounts);

        for(uint256 i = 0; i < ticketTypeCounts.length; i++) {
            uint256 ticketTypeCount = ticketTypeCounts[i];
            for(uint256 j = 0; j < ticketTypeCount; j++){
                uint256 tokenId = ticketTypes[i].currentTokenId + j;
                _safeMint(to, tokenId);

                Ticket memory ticket = Ticket(i, tokenId); 
                _tickets[tokenId] = ticket;
            }
            ticketTypes[i].currentTokenId += ticketTypeCount;
            mintsPerUser[to] += ticketTypeCount;
            mintsPerUserPerType[i][to] += ticketTypeCount;

        }

        emit UserMint(to, ticketTypeCounts);
    }

    /**
     * @notice a function for admins to mint cost-free
     * @param to the address to send the minted token to
     * @param amount amount of tokens to be minted by type
     **/
    function adminMint(address to, uint256[] memory amount)
        external
        whenNotPaused
        onlyOwner
    {
        require(to != address(0), "InvalidAddress");

        require(amount.length == ticketTypes.length, "Ticket type count parameter does not have correct length");

        checkMaxSupplyPerTicketType(amount);

        for(uint256 i = 0; i < amount.length; i++) {
            uint256 ticketTypeCount = amount[i];
            for(uint256 j = 0; j < ticketTypeCount; j++){
                uint256 tokenId = ticketTypes[i].currentTokenId + j;
                _safeMint(to, tokenId);

                Ticket memory ticket = Ticket(i, tokenId); 
                _tickets[tokenId] = ticket;
            }

            ticketTypes[i].currentTokenId += ticketTypeCount;
            mintsPerUser[to] += ticketTypeCount;
            mintsPerUserPerType[i][to] += ticketTypeCount;

        }
        emit AdminMint(to, amount);
    }

    /**
     * @notice a burn function for burning specific tokenId
     * @param tokenId Id of the Token
     **/
    function burn(uint256 tokenId) external {

        require(_msgSender() != address(0), "Msg sender cannot be zero");

        require(_exists(tokenId), "Token does not exist");

        require(
            ownerOf(tokenId) == _msgSender(),
            "NFTix: You do not own this token"
        );
        _burn(tokenId);
    }

    /**
     * @notice setPhase will set the new phase of the contract where both the nft cost and limit per user may change
     * @param phase is the new phase id that will be chosen 
     * @param mintCost is the new nft price in the new phase
     * @param mintingLimit_ is the minting limit per user 
     */
    function setPhase(
        Phase phase,
        uint256[] memory mintCost,
        uint32 mintingLimit_
    ) public onlyOwner {
        require(_phase != phase, "InvalidPhase");

        for (uint256 i = 0; i < mintCost.length; i++) {
            require(mintCost[i] >= 0, "InvalidNFTPrice");
            ticketTypes[i].price = mintCost[i];
        }

        _phase = phase;

        if (mintingLimit_ == 0) {
            useMintingLimit = false;
        }
        mintingLimit = mintingLimit_;

        emit PhaseChange(_phase, mintCost, mintingLimit);
    }


    /**
     * @notice changeBaseURI is a function where the link to the metadata can be changed
     * @param newBaseURI is the new string which links the metadata to the token
     */
    function changeBaseURI(string memory newBaseURI)
        public 
        onlyOwner
    {
        require(keccak256(abi.encodePacked((_baseTokenURI))) != keccak256(abi.encodePacked((newBaseURI))), "The base uri is the same as the previous");
        _baseTokenURI = newBaseURI;
    }

    /**
     * @notice changes merkleRoot in case whitelist updated
     * @param merkleRoot root of the Merkle tree
    **/
    function changeMerkleRoot(bytes32 merkleRoot)
        public
        onlyOwner
    {
        require(merkleRoot != _merkleRoot, "Merkle root is the same as the previous");
        _merkleRoot = merkleRoot;
    }

    /**
     * @notice checkUserLimit checks for the user if he/she are capable to mint more nfts
     * @param to is the address of the user
     * @param amount is the amount of nfts to be minted
     */
    function checkUserLimit(address to, uint256 amount) internal view returns (bool) {
        require(mintsPerUser[to]+amount<=mintingLimit, "Max token per user exceeded");
        return true;
    }

    /**
     * @notice checkMaxSupply checks if the contract has surpassed the maximum supply of tokens
     * @param amount is the amount of nfts the user is trying to mint
     */
    function checkMaxSupplyPerTicketType(uint256[] memory amount) public view returns (bool) {
        for(uint256 i = 0; i<amount.length; i++){
            require(amount[i]<=ticketTypes[i].endTokenId - ticketTypes[i].currentTokenId, "Max token is exceeded");
        }
        return true;
    }

    /**
     * @notice the public function validating addresses
     * @param proof_ hashes validating that a leaf exists inside merkle tree aka _merkleRoot
     **/
    function isAllowedToMint(bytes32[] memory proof_)
        internal
        view
        returns (bool)
    {
        require(MerkleProof.verify(proof_, _merkleRoot, keccak256(abi.encodePacked((msg.sender)))), "Not a whitelisted user");
        return true;
    }

    /**
     * @notice This is a public function only used by the owner where we can add the new ticket types
     * @param ticketRanges_ is an array of new ranges related to the new tickets
     * @param ticketPrices_ is an array of new prices related to the new tickets
     */
    function addTicketTypes(uint256[] memory ticketRanges_, uint256[] memory ticketPrices_) public onlyOwner {
        require(ticketPrices_.length == ticketRanges_.length, "TooManyPrices");
        require(ticketRanges_.length > 0 && ticketRanges_.length < 256, "TicketTypesInvalid");
        require(ticketPrices_.length > 0 && ticketPrices_.length < 256, "TicketPricesInvalid");
        require(ticketRanges_[0] > ticketTypes[ticketTypes.length - 1].endTokenId, "TicketTypesInvalid");

        uint256 startTokenId = 0;
        uint256 endTokenId = 0;

        for (uint256 i = 0; i < ticketPrices_.length; i++) {
            uint256 ticketRange = ticketRanges_[i];
            require(ticketRange > 0, "TicketCountInvalid");

            startTokenId = ticketTypes[ticketTypes.length - 1].endTokenId + 1;
            endTokenId = ticketRange;

            uint256 price = ticketPrices_[i];
            require(price >= 0, "TicketPricesInvalid");

            ticketTypes.push(
                TicketType({
                    ticketCount: ticketRange,
                    startTokenId: startTokenId,
                    endTokenId: endTokenId,
                    price: price,
                    currentTokenId: startTokenId
                })
            );
        }
    }

    /**
     * @notice getPhase is a getter function that returns the phase
     */
    function getPhase() public view returns (Phase) {
        return _phase;
    }

    /**
     * @notice _baseURI function returns the base uri set in the metadata
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @notice This function returns the ticket Struct in it is the tokenId and type
     * @param tokenId the tokenId of the the ticket minted
     */
    function getTicket(uint256 tokenId) public view returns (Ticket memory) {
        require(_exists(tokenId), "Token does not exist");
        return _tickets[tokenId];
    }

    /**
     * @notice This getter method returns next ticket id with a the certain type to be minted
     * @param ticketTypeId is the type Id used to know which Ticket ID to fetch
     */
    function getNextTicketId(uint256 ticketTypeId) public view returns (uint256) {
        require(ticketTypeId < ticketTypes.length, "Ticket type Id does not exist");
        return ticketTypes[ticketTypeId].currentTokenId;
    }

    /**
     * @notice This getter method returns the price of a ticket type
     * @param ticketTypeId is the type Id used to know which ticket Id to fetch
     */
    function getTicketPrice(uint256 ticketTypeId) public view returns (uint256) {
        require(ticketTypeId < ticketTypes.length, "Ticket type Id does not exist");
        return ticketTypes[ticketTypeId].price;
    }

    /**
     * This is a setter function that allows for the change of the prices per tokenType
     * @param tokenTypeId is the id of the token type that the price will be changed
     * @param price is the new price of the token type
     */
    function changeTicketPrice(uint256 tokenTypeId, uint256 price) public onlyOwner {
        require(tokenTypeId >= 0 || tokenTypeId < ticketTypes.length, "Token type id does not exist");
        ticketTypes[tokenTypeId].price = price;

    }

    /**
     * @notice if the ticker platform address is needed to be changed
     * @param newAdmin is the new admin of the ticket platform
     */
    function changeTicketPlatformAdmin(address newAdmin) public onlyTicketPlatformAdmin {
        require(newAdmin != ticketPlatformAdmin, "Same address for admin");
        ticketPlatformAdmin = newAdmin;
    }

    /**
     * @notice this function is for the owner to change the limit of much the user can mint
     * @param mintingLimit_ is the new limit of mints per user
     */
    function changeMintingLimit(uint32 mintingLimit_) public onlyOwner {
        require(mintingLimit_ < ticketTypes[ticketTypes.length - 1].endTokenId || mintingLimit_ >= 0, "Mint limit invalid");
        if(mintingLimit_ == 0) {useMintingLimit = false;}
        mintingLimit = mintingLimit_;
    }

    /**
     * @notice Its a setter where the ticket platform admin chooses whether the payment can be released on not form the payment splitter
     * @param activate is the boolean chosen if the admin chooses or not for the payment to be elligible for release
     */
    function paymentStatus(bool activate) public onlyTicketPlatformAdmin {
        isReleased = activate;
    }

    /**
     * @notice Is the an overriden release function of the PaymentSplitter contract where it can only be called if the release state is set as true
     * @param account is the account being sent the funds
     */
    function release(address payable account) public override {
        require(isReleased, "Cannot release funds");
        super.release(account);
    }

    ///@notice returns name of token
    function name() public view virtual override returns (string memory) {
        return _name;
    }

    /// @notice returns symbol of token
    function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }

}
