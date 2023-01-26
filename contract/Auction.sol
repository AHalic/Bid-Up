// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Define the Auction contract
contract Auction is ERC20{
    // Store the current highest bid and bidder
    uint256 public highestBid;
    address public highestBidder;
    // Stores all address who made a bid
    address[] public bidders;
    // Store the address of the seller and the start and end times of the auction
    address public seller;
    uint public endTime;
    uint public startTime;
    // Store the name of the product being auctioned
    string public productName;
    // Store the image data as a base64-encoded string
    string public imageData;
    bool public close = false;
    uint public closeDate;
    bool public payed = false;

    constructor (address _seller, uint _initialBid, uint _startTime, uint _endTime, string memory _productName, string memory _imageData) payable ERC20("Auction", "ACT") {
        highestBid = _initialBid;
        seller = _seller;
        startTime = _startTime;
        endTime = _endTime;
        productName = _productName;
        imageData = _imageData;
    }

    // Define an event for when a new bid is placed
    event NewBid(address bidder, uint value);
    // Define an event for when the auction is closed
    event AuctionClosed(uint finalBid, address winner);
    // Define an event for when the client finish the payment
    event Sold(address buyer, uint amount, uint balance);

    modifier bidAutorize (uint256 value) {
        // Check that the value of the new bid is higher than the current highest bid
        require(value > highestBid, "the bid must be higher");

        // Check that the auction is still open
        require(!close, "this auction is closed");
        _;
    }

    function generateToken(address sender, uint256 value) payable public {
        _mint(sender, value);
    }

    // Define a function to place a new bid
    function bid(uint256 value) public bidAutorize (value) {
        // Update the highest bid and bidder
        highestBid = value;
        highestBidder = msg.sender;
        bidders.push(msg.sender);

        // Trigger the NewBid event
        emit NewBid(msg.sender, value);
    }

    modifier closeAutorize(uint dateNow) {
        // Check that the caller is the seller
        require(!close, "This auction has already been closed");
        require(msg.sender == seller, "Only the owner can close this auction");
        require(dateNow >= endTime, "The auction can only be closed on the deadline");
        _;
    }

    modifier payAutorize() {
        // Check that the auction is closed
        require(close, "The auction is still open");
        require(!payed, "Product already payed");
        require(msg.sender == highestBidder, "Only the owner of the highest bid can pay");
        require(msg.value == highestBid, "The payment must be equal to the bid");
        _;
    }


    // Define a function to close the auction and finalize the results
    function closeAuction(uint dateNow) public closeAutorize(dateNow) {
        // Trigger the AuctionClosed event
        closeDate = dateNow;
        close = true;
        emit AuctionClosed(highestBid, highestBidder);
    }

    function pay() payable external payAutorize {
        payed = true;
        payable(seller).transfer(address(this).balance);
        emit Sold(msg.sender, msg.value, address(this).balance);
    }

    // Define a function that checks if a specific address has bid
    function addrHasBid(address adr) public view returns (bool) {
        for (uint i = 0; i < bidders.length; i++) {
            if (bidders[i] == adr) {
                return true;
            }
        }

        return false;
    }
}
