pragma solidity ^0.6.0;

import "Auction.sol";

// Define the ProductListing contract
contract ProductListing {
    // Create an array to store the information for each product being auctioned
    struct Product {
        string name;
        uint currentBid;
        uint timeRemaining;
        string imageData;
    }
    Product[] public products;

    // Define a function to add a new product to the list
    function addProduct(
        address _auctionAddress,
        string memory _productName,
        uint _currentBid,
        uint _timeRemaining,
        string memory _imageData
    ) public {
        // Add the product information to the products array
        products.push(Product(_productName, _currentBid, _timeRemaining, _imageData));
    }

    // Define a function to retrieve the list of all products being auctioned
    function getAllProducts() public view returns (Product[] memory) {
        return products;
    }

    // Define a function to retrieve the list of all products being auctioned by a specific user
    function getUserProducts(address _user) public view returns (Product[] memory) {
        // Create an array to store the products being auctioned by the user
        Product[] memory userProducts;
        // Iterate over all contract instances of the Auction contract
        for (uint i = 0; i < Auction.instanceCount(); i++) {
            // Get the address of the current Auction contract instance
            address auctionAddress = Auction.instances(i);
            // Retrieve the information for the current auction
            Auction auction = Auction(auctionAddress);
            // Check if the seller of the current auction is the user specified in the _user parameter
            if (auction.seller == _user) {
                // If they are, add the product information to the userProducts array
                userProducts.push(Product(
                    auction.productName(),
                    auction.highestBid,
                    auction.endTime - block.timestamp,
                    auction.imageData()
                ));
            }
        }
        // Return the array of products being auctioned by the user
        return userProducts;
    }
}
