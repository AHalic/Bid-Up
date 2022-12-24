pragma solidity ^0.6.0;

// Define the Auction contract
contract Auction {
    // Store the current highest bid and bidder
    uint public highestBid;
    address public highestBidder;

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
}

// Define the AuctionFactory contract
contract AuctionFactory {
    // Create an array to store the deployed contract instances
    Auction[] public deployedAuctions;

    // Define a function to create a new instance of the Auction contract
    function createAuction() public {
        // Deploy a new instance of the Auction contract and store it in the array
        deployedAuctions.push(new Auction());
    }
}
