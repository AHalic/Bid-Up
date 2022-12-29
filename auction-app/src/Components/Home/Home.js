import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';

import './Home.css';
import Header from "./../Header/Header";

export default function Home() {
    const [data, setData] = useState("")

    return (
        <div className="homeOuter">
            <Header boolSearch={true} data={data} setData={setData}/>
            {/* <div> */}
                <div className="homeContent">
                    {data ? 
                        <div className="innerContent">
                            <p className="titleHome">OPEN AUCTIONS</p>
                            {data.length > 0 ? 
                                data.map(auct => {

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