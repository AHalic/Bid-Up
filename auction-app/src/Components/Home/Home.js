import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';

import './Home.css';
import Header from "./../Header/Header";
import Card from "../Card/Card";

export default function Home({data, setData, signer, setSigner, auctFactory, setAuctFactory}) {
    
    return (
        <div className="homeOuter">
            <Header boolSearch={true} setData={setData} signer={signer} setSigner={setSigner} 
                auctFactory={auctFactory} setAuctFactory={setAuctFactory} />
            {/* <div> */}
                <div className="homeContent">
                    {data ? 
                        <div className="innerContent">
                            <p className="titleHome">OPEN AUCTIONS</p>
                            {data.length > 0 ? 
                                data.map(auct => {
                                    <Card auctionAddress={auct}/>
                                }) 
                            :
                                <p className="textNoAuct">No Auctions avaible</p>
                            }
                        </div>
                    :
                        <p className="titleHome">Login to start bidding!</p>
                    }
                </div>
            {/* </div> */}
        </div>
    );
}