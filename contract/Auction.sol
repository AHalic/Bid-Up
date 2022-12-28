// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

// Define the Auction contract
contract Auction {
    // Store the current highest bid and bidder
    uint public highestBid;
    address public highestBidder;
    // Stores all address who made a bid
    address[] public bidders;
    // Store the address of the seller and the start and end times of the auction
    address public seller;
    uint public endTime;
    // Store the name of the product being auctioned
    string public productName;
    // Store the image data as a base64-encoded string
    string public imageData;
    bool public close = false;

    constructor (address _seller, uint _initialBid, uint _endTime, string memory _productName, string memory _imageData) {
        highestBid = _initialBid;
        seller = _seller;
        endTime = _endTime;
        productName = _productName;
        imageData = _imageData;
    }

    // Define an event for when a new bid is placed
    event NewBid(address bidder, uint value);
    // Define an event for when the auction is closed
    event AuctionClosed(uint finalBid, address winner);

    modifier bidAutorize (uint value) {
        // Check that the value of the new bid is higher than the current highest bid
        require(value > highestBid);

        // Check that the auction is still open
        require(block.timestamp < endTime);
        _;
    }

    // Define a function to place a new bid
    function bid(uint value) public bidAutorize (value) {
        // Update the highest bid and bidder
        highestBid = value;
        highestBidder = msg.sender;
        bidders.push(msg.sender);

        // Trigger the NewBid event
        emit NewBid(msg.sender, value);
    }

    modifier closeAutorize {
        // Check that the caller is the seller
        require(msg.sender == seller);
        _;
    }

    // Define a function to close the auction and finalize the results
    function closeAuction() public closeAutorize {
        // Transfer the winning bid to the seller
        payable(seller).transfer(highestBid);
        // Trigger the AuctionClosed event
        emit AuctionClosed(highestBid, highestBidder);

        close = true;
    }

    function addrBid(address adr) public view returns (bool) {
        for (uint i = 0; i < bidders.length; i++) {
            if (bidders[i] == adr) {
                return true;
            }
        }

        return false;
    }

    function getClose() public view returns (bool) {
        return close;
    }
}
