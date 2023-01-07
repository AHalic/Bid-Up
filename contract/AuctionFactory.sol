// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "./Auction.sol";


// Define the AuctionFactory contract
contract AuctionFactory {
    // Create an array to store the deployed contract instances
    Auction[] public deployedAuctions;


    event AuctionCreated(address seller, address auction, string name, uint256 createdAt);


    // Define a function to create a new instance of the Auction contract
    function createAuction(
        address _seller,
        uint _initialBid,
        string memory _productName,
        uint _startTime,
        uint _endTime,
        string memory _imageData
    ) external payable {
        // Deploy a new instance of the Auction contract and store it in the array
        Auction auctionContract = new Auction(_seller, _initialBid, _startTime, _endTime, _productName, _imageData);
        deployedAuctions.push(auctionContract);

        emit AuctionCreated(_seller, address(auctionContract), _productName, _startTime);
    }


    // LISTING ALL INTERACTIONS OF AN USER

    // Define a function to retrieve the list of auctions that a user has participated in
    function getUserHistory(address _user) public view returns (Auction[] memory) {
        uint size = 0;

        // Iterate over all contract instances of the Auction contract
        for (uint i = 0; i < deployedAuctions.length; i++) {
            // Retrieve the information for the current auction
            Auction auction = deployedAuctions[i];

            // Check if the user has participated in the current auction
            if (auction.addrHasBid(_user)) {
                size += 1;
            }
        }

        uint j = 0;

        // Create an array to store the auctions that the user has participated in
        Auction[] memory userHistory = new Auction[](size);

        for (uint i = 0; i < deployedAuctions.length; i++) {
            Auction auction = deployedAuctions[i];

            if (auction.addrHasBid(_user)) {
                userHistory[j] = auction;
                j += 1;
            }
        }
        // Return the array of auctions that the user has participated in
        return userHistory;
    }

    function getAuctions() public view returns (Auction[] memory) {
        return deployedAuctions;
    }
}
