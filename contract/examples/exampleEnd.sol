pragma solidity ^0.6.0;

contract Auction {
    // Store the current highest bid and bidder
    uint public highestBid;
    address public highestBidder;
    // Store the address of the seller
    address public seller;

    // Define an event for when a new bid is placed
    event NewBid(address bidder, uint value);

    // Define a function to place a new bid
    function bid(uint value) public {
        // Check that the value of the new bid is higher than the current highest bid
        require(value > highestBid);
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
        // Set the highest bid and bidder to zero to indicate that the auction is closed
        highestBid = 0;
        highestBidder = address(0);
    }
}