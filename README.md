# Bid Up
An auction website using blockchain implemented to the Blockchain course by [Sophie Dilhon](https://github.com/AHalic).

## Functionalities
The platform consists of a website where you can create your own Auctions, bid to them and pay using GoerliETH.
One can only pay for a product if he was the winner of the auction, and if it's already closed.
The owner can only close the auction when the deadline is reached, then, once closed, the auction will not receive any further bids.

## Blockchain
A factory contract is used to create a contract for each one of the auctions, these that keep the product's data. Events happen on three occasions: when a bid is confirmed, when the auction is closed and when the buyer pays for the product.

## Instructions
The website is deployed and can be accessed through this [link](https://auction-app-psi.vercel.app/) or it can run locally by cloning the repository and running the following commands on the following commands in the console:

```
npm install
npm start
```
This way, you can access the application at [localhost:3000](https://localhost:3000).

To log in, you must have MetaMask's plugin installed in your browser.


## Tools
- Front-end: JS | React.js | Material-UI
- Data:
    - Goerli Testnet Contract: [Solidity](https://docs.soliditylang.org/en/v0.8.17/)
    - [Supabase Storage](https://supabase.com/storage) (host images)
