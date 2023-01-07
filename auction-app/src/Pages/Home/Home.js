import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
// import { Link, useNavigate } from 'react-router-dom';

import './Home.css';
import Header from "./../../Components/Header/Header";
import Card from "./../../Components/Card/Card";
import auction from "../../Services/keys/auctionKeys";

export default function Home({signer, setSigner, auctFactory, setAuctFactory, auctions, isHome, title}) {
    const { search } = window.location;
    const query = new URLSearchParams(search).get('s');
    const [searchQuery, setSearchQuery] = useState(query || '');
    const [data, setData] = useState("")

    // Get array of auctions    
    // useEffect(() => {
    //     getAuctions()
    // }, [auctFactory, searchQuery])
    
    // Search bar functions
    useEffect(() => {
        const getAuctions = async () => {
            if (auctFactory) {
                var openData = []
                await Promise.all(auctions.map(async (address) => {
                    const auctionContract = new ethers.Contract(address, auction.abi, signer)
                    const close = await auctionContract.close()
    
                    if (!close)
                        openData.push(address)
                }))
                    .then(() => {
                        setData(openData);
                    })
            } else {
                setData(false)
            }
        }
        const searchData = async () => {
            if (auctFactory) {
                var newData = []
                await Promise.all(auctions.map(async (address) => {
                    const auctionContract = new ethers.Contract(address, auction.abi, signer)
                    const productName = await auctionContract.productName()
                    const close = await auctionContract.close()
                    
                    if (productName.toLowerCase().includes(searchQuery.toLowerCase()) && !close)
                        newData.push(address)
                }))
                    .then(() => {
                        setData(newData);
                    })

            } else {
                setData(false)
            }
        }
        const getHistory = async () => {
            if (auctFactory) {    
                var payedData = []
                await Promise.all(auctions.map(async (address) => {
                    const auctionContract = new ethers.Contract(address, auction.abi, signer)
                    const bidder = await auctionContract.highestBidder()
                    const payed = await auctionContract.payed()
    
                    if (payed && bidder === signer._address) {
                        payedData.push(address)
                    }
                }))
                    .then(() => {
                        setData(payedData)
                    })
            } else {
                setData(false)
            }
        }

        if (auctions) {
            if (isHome) {
                if (!searchQuery) {
                    getAuctions()
                }
                else {
                    searchData()
                }
            } else {
                getHistory()
            }
        }
    }, [searchQuery, auctFactory, signer, isHome, auctions])
    
    return (
        <div className="homeOuter">
            <Header boolSearch={isHome} setSigner={setSigner} auctFactory={auctFactory} 
                setAuctFactory={setAuctFactory} setSearchQuery={setSearchQuery}/>
            {/* <div> */}
                <div className="homeContent">
                    {data ? 
                        <div className="innerContent">
                            <p className="titleHome">{title}</p> 
                            {/* OPEN AUCTIONS */}
                            <div className="cardsContainer">
                                {data.length > 0 ? 
                                    data.map(auct => (
                                        <Card key={auct} auctionAddress={auct} signer={signer} isMyBid={false}/>
                                    )) 
                                :
                                    <p className="textNoAuct">No Auctions avaible</p>
                                }
                            </div>
                        </div>
                    :
                        <p className="titleHome">Login to start bidding!</p>
                    }
                </div>
            {/* </div> */}
        </div>
    );
}