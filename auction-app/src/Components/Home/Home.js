import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
// import { Link, useNavigate } from 'react-router-dom';

import './Home.css';
import Header from "./../Header/Header";
import Card from "../Card/Card";
import auction from "../../Services/keys/auctionKeys";

export default function Home({signer, setSigner, auctFactory, setAuctFactory}) {
    const { search } = window.location;
    const query = new URLSearchParams(search).get('s');
    const [searchQuery, setSearchQuery] = useState(query || '');
    const [data, setData] = useState("")

    // Get array of auctions    
    const getAuctions = async () => {
        if (!searchQuery) {
            if (auctFactory) {
                const data = await auctFactory.getAuctions()
    
                var openData = []
                await Promise.all(data.map(async (address) => {
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
    }
    useEffect(() => {
        getAuctions()
    }, [auctFactory, searchQuery])

    // Search bar functions
    useEffect(() => {
        const searchData = async () => {
            if (searchQuery) {
                if (auctFactory) {
                    const localData = await auctFactory.getAuctions()

                    var newData = []
                    await Promise.all(localData.map(async (address) => {
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
        }
        searchData()
    }, [searchQuery, auctFactory, signer])
    
    return (
        <div className="homeOuter">
            <Header boolSearch={true} setSigner={setSigner} auctFactory={auctFactory} 
                setAuctFactory={setAuctFactory} setSearchQuery={setSearchQuery}/>
            {/* <div> */}
                <div className="homeContent">
                    {data ? 
                        <div className="innerContent">
                            <p className="titleHome">OPEN AUCTIONS</p>

                            <div className="cardsContainer">
                                {data.length > 0 ? 
                                    data.map(auct => (
                                        <Card key={auct} auctionAddress={auct} signer={signer}/>
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