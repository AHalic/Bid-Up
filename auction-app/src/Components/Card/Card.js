import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

import './Card.css'
import auction from "../../Services/keys/auctionKeys";

export default function Card({auctionAddress, signer}) {
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [image, setImage] = useState("")
    const [deadline, setDeadline] = useState("")

    useEffect(() => {
        const getData = async () => {
            const auctionContract = new ethers.Contract(auctionAddress, auction.abi, signer)

            const auctName = await auctionContract.productName()
            setName(auctName)

            const auctPrice = await auctionContract.highestBid()
            setPrice(auctPrice)

            const auctImage = await auctionContract.imageData()
            setImage(auctImage)

            const auctEndDate = await auctionContract.endTime()
            const endDate = new Date(auctEndDate)
            const today = new Date()
            setDeadline(endDate - today)
        }
        getData()
        
    }, [])

    return (
        <div className="card">
            <div className="cardImageDiv">
                <img className="cardImage" src={image} alt={`${name}`}/>
            </div>
            <div className="cardInfo">
                <p className="cardTitle">{name}</p>
                <p className="cardPrice">{`US $${price}`}</p>
                {/* <p className="cardTimeLeft">{`${deadline/1000*60*60*24}d ${(deadline/1000*60*60)%24}h`}</p> */}
                <p className="cardTimeLeft">1d 3h</p>
            </div>
        </div>
    )
}