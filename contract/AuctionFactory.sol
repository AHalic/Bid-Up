pragma solidity ^0.6.0;

import "Auction.sol";

// Define the AuctionFactory contract
contract AuctionFactory {
    // Create an array to store the deployed contract instances
    Auction[] public deployedAuctions;

    // Define a function to create a new instance of the Auction contract
    function createAuction(
        address _seller,
        string memory _productName,
        uint _startTime,
        uint _endTime,
        string memory _imageData
    ) public {
        // Deploy a new instance of the Auction contract and store it in the array
        deployedAuctions.push(new Auction(_seller, _startTime, _endTime, _productName, _imageData));
    }
}
