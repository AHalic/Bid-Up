pragma solidity ^0.6.0;

// Define the Auction contract
contract Auction {
    // Store the current highest bid and bidder
    uint public highestBid;
    address public highestBidder;
    // Store the address of the seller and the start and end times of the auction
    address public seller;
    uint public startTime;
    uint public endTime;
    // Store the name of the product being auctioned
    string public productName;
    // Store the image data as a base64-encoded string
    string public imageData;

    // Define an event for when a new bid is placed
    event NewBid(address bidder, uint value);
    // Define an event for when the auction is closed
    event AuctionClosed(uint finalBid, address winner);

    // Define a function to place a new bid
    function bid(uint value) public {
        // Check that the value of the new bid is higher than the current highest bid
        require(value > highestBid);
        // Check that the auction is still open
        require(block.timestamp < endTime);
        // Update the highest bid and bidder
        highestBid = value;
        highestBidder = msg.sender;
        // Trigger the NewBid event
        emit NewBid(msg.sender, value);
    }

    // Define a function to close the auction and finalize the results
    function closeAuction() public {
        // Check that the caller is the seller
        require(msg.sender == seller);
        // Transfer the winning bid to the seller
        highestBidder.transfer(highestBid);
        // Trigger the AuctionClosed event
        emit AuctionClosed(highestBid, highestBidder);
        // Set the highest bid and bidder to zero to indicate that the auction is closed
        highestBid = 0;
        highestBidder = address(0);
    }

    // Define a function to retrieve the deployer of the contract
    function deployer() public view returns (address) {
        return msg.sender;
    }
}
