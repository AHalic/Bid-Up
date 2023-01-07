import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
// import { Link, useNavigate } from 'react-router-dom';

import '../../Pages/Home/Home.css';
import Header from "../../Components/Header/Header";
import Card from "../../Components/Card/Card";
import auction from "../../Services/keys/auctionKeys";

export default function Home({signer, setSigner, auctFactory, setAuctFactory}) {
    const [openAuct, setOpenAuct] = useState("")
    const [closeAuct, setCloseAuct] = useState("")

    // Get array of auctions    
    const getAuctions = async () => {
        if (auctFactory) {
            const data = await auctFactory.getUserHistory(signer._address)

            var openData = []
            var closeData = []
            await Promise.all(data.map(async (address) => {
                const auctionContract = new ethers.Contract(address, auction.abi, signer)
                const close = await auctionContract.close()
                const payed = await auctionContract.payed()

                if (!close) {
                    openData.push(address)
                }
                else {
                    if (!payed)
                        closeData.push(address)
                }
            }))
                .then(() => {
                    setOpenAuct(openData)
                    setCloseAuct(closeData)
                })
        } else {
            setOpenAuct(false)
            setCloseAuct(false)
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
                    {closeAuct && closeAuct.length > 0 ? 
                        <div className="innerContent">
                            <p className="titleHome">WAITING PAYMENT</p>

                            <div className="cardsContainer">
                                {
                                    closeAuct.map(auct => (
                                        <Card key={auct} auctionAddress={auct} signer={signer} isMyBid={true}/>
                                    )) 
                                }
                            </div>
                        </div>
                    : null}
                    {openAuct && openAuct.length > 0 ?
                        <div className="innerContent">
                            <p className="titleHome">MY BIDS</p>

                            <div className="cardsContainer">
                                {
                                    openAuct.map(auct => (
                                        <Card key={auct} auctionAddress={auct} signer={signer} isMyBid={true}/>
                                    )) 
                                }
                            </div>
                        </div>
                    : null}
                    {closeAuct && openAuct && openAuct.length === 0 && closeAuct.length === 0 ?
                            <p className="titleHome">You haven't bid yet</p>
                    : null}
                    {openAuct === false || closeAuct === false ? 
                        <p className="titleHome">You haven't bid yet</p>
                    : null}
                    
                </div>

        </div>
    );
}