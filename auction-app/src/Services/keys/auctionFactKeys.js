const auctionFact = {
    "abi": [
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
            "stateMutability": "nonpayable",
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
    "address": '0xcfB67eA319AaFf084F57f9dD4d9CAe449857Da55'
}

export default auctionFact