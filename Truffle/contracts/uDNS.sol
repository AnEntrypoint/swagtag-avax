// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract UDNS is ERC721URIStorage, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping(string => uint256) _names;
    mapping(string => string) _addresses;

    mapping(uint256 => uint256) _id_to_trade;
    //IERC20 currencyToken;
    IERC721 itemToken;

    constructor(/*address _currencyTokenAddress*/) ERC721("UDNS", "UDT") {
        //currencyToken = IERC20(_currencyTokenAddress);
        itemToken = IERC721(address(this));
        tradeCounter = 0;
    }

    event TradeStatusChange(uint256 ad, bytes32 status, uint256 price, string name, uint256 item);

    struct Trade {
        address payable poster;
        uint256 item;
        uint256 price;
        bytes32 status; // Open, Executed, Cancelled
    }

    mapping(uint256 => Trade) public trades;

    uint256 tradeCounter;

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
     * @dev Returns the details for a trade.
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
        virtual
    {
        if(!isApprovedForAll(address(this), msg.sender)) setApprovalForAll(address(this), true);
        itemToken.transferFrom(msg.sender, address(this), _item);
        trades[tradeCounter].poster = payable(msg.sender);
        trades[tradeCounter].item = _item;
        trades[tradeCounter].price = _price;
        trades[tradeCounter].status = "Open";
        tradeCounter += 1;
        emit TradeStatusChange(tradeCounter - 1, "Open", _price, tokenURI(_item), _item);
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
        if(!isApprovedForAll(address(this), msg.sender)) setApprovalForAll(address(this), true);
        Trade memory trade = trades[_trade];
        require(trade.status == "Open", "Trade is not Open.");
        trade.poster.transfer(trade.price);   //pays previous owner requested amount
        //currencyToken.transferFrom(msg.sender, trade.poster, trade.price);
        itemToken.transferFrom(address(this), msg.sender, trade.item);
        trades[_trade].status = "Executed";
        emit TradeStatusChange(_trade, "Executed", 0, tokenURI(trade.item), trade.item);
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
        emit TradeStatusChange(_trade, "Cancelled", 0, tokenURI(trade.item), trade.item);
    }

    function mintToken(string memory name)
        public
        payable
        returns (uint256)
    {
        _tokenIds.increment();
        require( !(_names[name]>0), "Token already exists" );
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, name);
        _names[name] = newItemId;
        payable(owner()).transfer(10000000000000000);

        return newItemId;
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }


    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
        string memory name = tokenURI(tokenId);
        if (_names[name] != 0) {
            delete _names[name];
            delete _addresses[name];
        }
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
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function safeMint(address to, uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId);
    }

    function getAddress(string memory _name)
        public
        view
        returns(string memory)
    {
        return _addresses[_name];
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
        _addresses[_name] = _address;
    }

}