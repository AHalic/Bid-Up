import { ethers } from "ethers";
import auction from "./keys/auctionKeys";

export async function loginMetaMask(setAuctFactoryContract) {

    const provider = new ethers.providers.Web3Provider(window.ethereum, "goerli");

    provider.send("eth_requestAccounts", []).then(() => {
        provider.listAccounts().then((accounts) => {
        const signer = provider.getSigner(accounts[0]);
        
        const auctionContract = new ethers.Contract(auction.address, auction.abi, signer)
        setAuctFactoryContract(auctionContract)

        });
    });
}

