// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";

contract Swagtag is Initializable, ERC721Upgradeable, ERC721EnumerableUpgradeable, ERC721URIStorageUpgradeable, OwnableUpgradeable, UUPSUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;

    CountersUpgradeable.Counter private _tokenIdCounter;

    CountersUpgradeable.Counter private _tradeCounter;
    mapping(string => uint256) _names;
    mapping(string => string) _addresses;

    event Payment(uint256 price, string name, uint256 item, string message);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize() initializer public {
        __ERC721_init("swagtag", "SWG");
        __ERC721Enumerable_init();
        __ERC721URIStorage_init();
        __Ownable_init();
        itemToken = this;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://domains.fujiavax.ga/";
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    /**
     * @dev pays a swagtag owner, emitting an event
     * @param _item The id of an existing item
     * @param _amount the wei amount
     */
    function pay(uint256 _item, uint256 _amount, string memory _memo) public payable virtual {
        uint256 fee = _amount/100;
        payable(ownerOf(_item)).transfer(_amount-fee);
        payable(owner()).transfer(fee);
        emit Payment(_amount, tokenURI(_item), _item, _memo);
    }

    /**
     * @dev pays a swagtag owner, emitting an event
     * @param _name The name of an existing item
     * @param _amount the wei amount
     */
    function payName(string memory _name, uint256 _amount, string memory _memo) public payable virtual {
        uint256 _item =  _names[_name];
        uint256 fee = _amount/100;
        payable(ownerOf(_item)).transfer(_amount-fee);
        payable(owner()).transfer(fee);
        emit Payment(_amount, tokenURI(_item), _item, _memo);
    }

    /**
     * @dev mint a fresh swagtag
     * @param _name the swagtag name
     */
    function mintToken(string memory _name)
        public
        payable
        returns (uint256)
    {
        _tokenIdCounter.increment();
        require( !(_names[_name]>0), "Token already exists" );
        uint256 newItemId = _tokenIdCounter.current();
        _mint(msg.sender, newItemId);
        _id_to_name[newItemId] = _name;
        _setTokenURI(newItemId, _name);
        _names[_name] = newItemId;
        payable(owner()).transfer(10000000000000000);
        return newItemId;
    }    

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {}

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 _tokenId)
        internal
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
    {
        super._burn(_tokenId);
        string memory _name = _id_to_name[_tokenId];
        if (_names[_name] != 0) {
            delete _id_to_name[_tokenId];
            delete _names[_name];
            delete _addresses[_name];
            if(_id_to_trade[_tokenId]>0) delete _id_to_trade[_tokenId];
        }
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function getAddress(string memory _name)
        public
        view
        returns(string memory)
    {
        return _addresses[_name];
    }

    function getId(string memory _name)
        public
        view
        returns(uint256 id)
    {
        return _names[_name];
    }

    function getName(uint256 tokenId)
        public
        view
        returns(string memory)
    {
        return tokenURI(tokenId);
    }

    function setAddress(string memory _name, string memory _address)
        public
    {
        require(ownerOf(_names[_name]) == msg.sender, "Only the owner can do this");
        _id_to_name[_names[_name]] = _name; //TODO: remove after allowing first addresses to fix themselves
        _setTokenURI(_names[_name], _name); //TODO: remove after allowing first addresses to fix themselves
        _addresses[_name] = _address;
    }


    //MARKET 

    mapping(uint256 => uint256) _id_to_trade;
    event TradeStatusChange(uint256 ad, bytes32 status, uint256 price, string name, uint256 item);

    IERC721Upgradeable itemToken;

    struct Trade {
        address payable poster;
        uint256 item;
        uint256 price;
        bytes32 status; // Open, Executed, Cancelled
    }

    mapping(uint256 => Trade) public trades;

    /**
     * @dev Returns the details for a trade.
     * @param _trade The id for the trade.
     */
    function getTrade(uint256 _trade)
        public
        virtual
        view
        returns(address, uint256, uint256, bytes32)
    {
        Trade memory trade = trades[_trade];
        return (trade.poster, trade.item, trade.price, trade.status);
    }

    /**
     * @dev Returns the trade for a id
     * @param _id The id of the domain
     */
    function getTradeForId(uint256 _id)
        public
        virtual
        view
        returns(address, uint256, uint256, bytes32)
    {
        uint256 _trade = _id_to_trade[_id];
        Trade memory trade = trades[_trade];
        return (trade.poster, trade.item, trade.price, trade.status);
    }

    /**
     * @dev Opens a new trade. Puts _item in escrow.
     * @param _item The id for the item to trade.
     * @param _price The amount of currency for which to trade the item.
     */
    function openTrade(uint256 _item, uint256 _price)
        public
        payable
        virtual
    {
        itemToken.transferFrom(msg.sender, address(this), _item);
        uint256 current = _tradeCounter.current();
        trades[current].poster = payable(msg.sender);
        trades[current].item = _item;
        trades[current].price = _price;
        trades[current].status = "Open";
        emit TradeStatusChange(current, "Opened", _price,tokenURI(_item), _item);
        _tradeCounter.increment();

    }

    /**
     * @dev Executes a trade. Must have approved this contract to transfer the
     * amount of currency specified to the poster. Transfers ownership of the
     * item to the filler.
     * @param _trade The id of an existing trade
     */
    function executeTrade(uint256 _trade)
        public
        payable
        virtual
    {
        Trade memory trade = trades[_trade];
        require(trade.status == "Open", "Trade is not Open.");
        trade.poster.transfer(trade.price);   //pays previous owner requested amount
        //currencyToken.transferFrom(msg.sender, trade.poster, trade.price);
        itemToken.transferFrom(address(this), msg.sender, trade.item);
        trades[_trade].status = "Executed";
        emit TradeStatusChange(_trade, "Executed", 0,tokenURI(trade.item), trade.item);
    }

    /**
     * @dev Cancels a trade by the poster.
     * @param _trade The trade to be cancelled.
     */
    function cancelTrade(uint256 _trade)
        public
        virtual
    {
        Trade memory trade = trades[_trade];
        require(
            msg.sender == trade.poster,
            "Trade can be cancelled only by poster."
        );
        require(trade.status == "Open", "Trade is not Open.");
        itemToken.transferFrom(address(this), trade.poster, trade.item);
        trades[_trade].status = "Cancelled";
        emit TradeStatusChange(_trade, "Cancelled", 0,tokenURI(trade.item), trade.item);
    }

    mapping(uint256 => string) _id_to_name;

    function getNameForId(uint256 _tokenId)
        public
        view
        returns(string memory)
    {
        return _id_to_name[_tokenId];
    }

    function getAddressForId(uint256 _tokenId)
        public
        view
        returns(string memory)
    {
        return _addresses[_id_to_name[_tokenId]];
    }

}