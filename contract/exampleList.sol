pragma solidity ^0.6.0;

import "Auction.sol";

contract ProductListing {
    // Create an array to store the information for each product being auctioned
    struct Product {
        string name;
        uint currentBid;
        uint timeRemaining;
    }
    Product[] public products;

    // Define a function to retrieve the information for each product being auctioned
    function listProducts() public {
        // Iterate over all contract instances of the Auction contract
        for (uint i = 0; i < Auction.instanceCount(); i++) {
            // Get the address of the current Auction contract instance
            address auctionAddress = Auction.instances(i);
            // Retrieve the information for the current auction
            Auction auction = Auction(auctionAddress);
            // Check if the auction is still open
            if (auction.highestBid > 0) {
                // If it is, add the product information to the products array
                products.push(Product(
                    auction.productName(),
                    auction.highestBid,
                    auction.endTime - block.timestamp
                ));
            }
        }
    }
}
