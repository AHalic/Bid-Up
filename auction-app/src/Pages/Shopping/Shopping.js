import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
// import { Link, useNavigate } from 'react-router-dom';

import '../../Pages/Home/Home.css';
import Header from "../../Components/Header/Header";
import Card from "../../Components/Card/Card";
import auction from "../../Services/keys/auctionKeys";

export default function Home({signer, setSigner, auctFactory, setAuctFactory}) {
    const [payedAuct, setPayedAuct] = useState("")

    // Get array of auctions    
    const getAuctions = async () => {
        if (auctFactory) {
            const data = await auctFactory.getUserHistory(signer._address)

            var payedData = []
            await Promise.all(data.map(async (address) => {
                const auctionContract = new ethers.Contract(address, auction.abi, signer)
                const bidder = await auctionContract.highestBidder()
                const payed = await auctionContract.payed()

                if (payed && bidder === signer._address) {
                    payedData.push(address)
                }
            }))
                .then(() => {
                    setPayedAuct(payedData)
                })
        } else {
            setPayedAuct(false)
        }
    }
    useEffect(() => {
        getAuctions()
    }, [auctFactory, signer])

    
    return (
        <div className="homeOuter">
            <Header boolSearch={false} setSigner={setSigner} auctFactory={auctFactory} 
                setAuctFactory={setAuctFactory}/>

                <div className="homeContent">
                    {payedAuct ? 
                        <div className="innerContent">
                            <p className="titleHome">MY SHOPPING</p>

                            <div className="cardsContainer">
                                {payedAuct.length > 0 ? 
                                    payedAuct.map(auct => (
                                        <Card key={auct} auctionAddress={auct} signer={signer} isMyBid={false}/>
                                    )) 
                                :
                                    <p className="textNoAuct">You haven't bought anything yet...</p>
                                }
                            </div>
                        </div>
                    :
                        <p className="titleHome">Login to see your shopping!</p>
                    }
                </div>

        </div>
    );
}