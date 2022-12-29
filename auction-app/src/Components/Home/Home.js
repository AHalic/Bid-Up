import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';

import Header from "./../Header/Header";

export default function Home() {
    const [data, setData] = useState("")

    return (
        <div>
            <Header boolSearch={true} data={data} setData={setData}/>
            <div>
                <div className="homeContent">
                    {data ? 
                        data.map(auct => {

                        })
                    :
                        <h1>Login to start bidding!</h1>
                    }
                </div>
            </div>
        </div>
    );
}