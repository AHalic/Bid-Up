import React from "react";

import Header from "../Header/Header";
import "./Product.css";
import "../Home/Home.css";

export default function Product({address, setSigner, auctFactory, setAuctFactory}) {
    return (
        <div className="homeOuter">
            <Header boolSearch={false} setSigner={setSigner} auctFactory={auctFactory} 
                setAuctFactory={setAuctFactory}/>
        </div>
    )
}