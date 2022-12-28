pragma solidity ^0.6.0;

import "Auction.sol";

// Define the UserHistory contract
contract UserHistory {
    // Define a mapping to store the auctions that a user has participated in
    mapping(address => bool) public participatedIn;

    // Define a function to retrieve the list of auctions that a user has participated in
    function getUserHistory(address _user) public view returns (Auction[] memory) {
        // Create an array to store the auctions that the user has participated in
        Auction[] memory userHistory;
        // Iterate over all contract instances of the Auction contract
        for (uint i = 0; i < Auction.instanceCount(); i++) {
            // Get the address of the current Auction contract instance
            address auctionAddress = Auction.instances(i);
            // Retrieve the information for the current auction
            Auction auction = Auction(auctionAddress);
            // Check if the user has participated in the current auction
            if (auction.highestBidder == _user) {
                // If they have, add the auction to the userHistory array
                userHistory.push(auction);
            }
        }
        // Return the array of auctions that the user has participated in
        return userHistory;
    }
}
