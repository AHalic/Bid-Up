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
        // Set the highest bid and bidder to zero to indicate that the auction is closed
        highestBid = 0;
        highestBidder = address(0);
    }

    // Define a function to retrieve the deployer of the contract
    function deployer() public view returns (address) {
        return msg.sender;
    }
}

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
                    auction.endTime - block.timestamp,
                    auction.imageData
                ));
            }
        }
    }
}