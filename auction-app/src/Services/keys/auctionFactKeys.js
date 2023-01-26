const auctionFact = {
    "abi": [
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "seller",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "auction",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "createdAt",
                    "type": "uint256"
                }
            ],
            "name": "AuctionCreated",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_seller",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "_initialBid",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "_productName",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "_startTime",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "_endTime",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "_imageData",
                    "type": "string"
                }
            ],
            "name": "createAuction",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "deployedAuctions",
            "outputs": [
                {
                    "internalType": "contract Auction",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getAuctions",
            "outputs": [
                {
                    "internalType": "contract Auction[]",
                    "name": "",
                    "type": "address[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_user",
                    "type": "address"
                }
            ],
            "name": "getUserHistory",
            "outputs": [
                {
                    "internalType": "contract Auction[]",
                    "name": "",
                    "type": "address[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ],
    "address": '0x670c457e6CF2923517889C529b00380230bb01eB'
}

export default auctionFact