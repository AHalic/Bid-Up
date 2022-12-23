pragma solidity ^0.6.0;

contract Auction {
    // Store the current highest bid and bidder
    uint public highestBid;
    address public highestBidder;
    // Store the address of the seller and the start time of the auction
    address public seller;
    uint public startTime;

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
        // Check that the current block timestamp is greater than the start time of the auction plus the desired duration
        require(block.timestamp > startTime + 5 days);
        // Transfer the winning bid to the seller
        highestBidder.transfer(highestBid);
        // Set the highest bid and bidder to zero to indicate that the auction is closed
        highestBid = 0;
        highestBidder = address(0);
    }
}

// Define the AuctionFactory contract
contract AuctionFactory {
    // Create an array to store the deployed contract instances
    Auction[] public deployedAuctions;

    // Define a function to create a new instance of the Auction contract
    function createAuction(address _seller) public {
        // Deploy a new instance of the Auction contract and store it in the array
        deployedAuctions.push(new Auction(_seller, now));
    }
}
