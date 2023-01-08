import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
// import { Link, useNavigate } from 'react-router-dom';

import '../../Pages/Home/Home.css';
import Header from "../../Components/Header/Header";
import Card from "../../Components/Card/Card";
import auction from "../../Services/keys/auctionKeys";

export default function Home({signer, setSigner, auctFactory, setAuctFactory, auctions, isBid, title1, title2}) {
    const [openAuct, setOpenAuct] = useState("")
    const [closeAuct, setCloseAuct] = useState("")

    useEffect(() => {
        // Get array of auctions    
        const getAuctionsInteracted = async () => {
            if (auctFactory) {
                var openData = []
                var closeData = []
                await Promise.all(auctions.map(async (address) => {
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

        const getAuctionsCreated = async () => {
            if (auctFactory) {
                var openData = []
                var closeData = []
                await Promise.all(auctions.map(async (address) => {
                    const auctionContract = new ethers.Contract(address, auction.abi, signer)
                    const close = await auctionContract.close()
                    const owner = await auctionContract.seller()

                    if (owner === signer._address) {
                        if (close) {
                            openData.push(address)
                        }
                        else {
                            closeData.push(address)
                        }
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

        if (auctions) {
            if (isBid) {
                getAuctionsInteracted()
            } else {
                getAuctionsCreated()
            }
        }
    }, [auctFactory, auctions, isBid, signer])

    
    return (
        <div className="homeOuter">
            <Header boolSearch={false} setSigner={setSigner} auctFactory={auctFactory} 
                setAuctFactory={setAuctFactory}/>

                <div className="homeContent">
                    {closeAuct && closeAuct.length > 0 ? 
                        <div className="innerContent">
                            <p className="titleHome">{title1}</p> 
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
                            <p className="titleHome">{title2}</p>

                            <div className="cardsContainer">
                                {
                                    openAuct.map(auct => (
                                        <Card key={auct} auctionAddress={auct} signer={signer} isMyBid={isBid}/>
                                    )) 
                                }
                            </div>
                        </div>
                    : null}
                    {closeAuct && openAuct && openAuct.length === 0 && closeAuct.length === 0 ?
                            <p className="titleHome">{isBid ? 'You haven\'t bid yet' : 'You have no auctions yet'}</p>
                    : null}
                    {openAuct === false || closeAuct === false ? 
                        <p className="titleHome">Login to start!</p>
                    : null}
                    
                </div>

        </div>
    );
}