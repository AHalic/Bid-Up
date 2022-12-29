import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

export default function Card({auctionAddress}) {
    const [image, setImage] = useState("")
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [deadline, setDeadline] = useState("")

    useEffect(() => {
        
    }, [auctionAddress])

    return (
        <div className="card">

        </div>
    )
}