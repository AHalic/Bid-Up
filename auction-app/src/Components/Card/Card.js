import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

import './Card.css'
import auction from "../../Services/keys/auctionKeys";

export default function Card({auctionAddress, signer}) {
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [image, setImage] = useState("")
    const [deadline, setDeadline] = useState("")
    const [auctContract, setAuctContract] = useState("")

    useEffect(() => {
        const getData = async () => {
            const auctionContract = new ethers.Contract(auctionAddress, auction.abi, signer)
            setAuctContract(auctionContract)

            const auctName = await auctionContract.productName()
            setName(auctName)

            const auctPrice = await auctionContract.highestBid()
            setPrice(auctPrice)

            const auctImage = await auctionContract.imageData()
            setImage(auctImage)

            const auctEndDate = await auctionContract.endTime()
            const endDate = new Date(Number(auctEndDate))
            
            const today = new Date()

            setDeadline(endDate - today)
        }
        getData()

    }, [])

    function handleClick() {
        
    }

    return (
        <div className="card" onClick={handleClick}>
            <div className="cardImageDiv">
                <img className="cardImage" src={image} alt={`${name}`}/>
            </div>
            <div className="cardInfo">
                <p className="cardTitle">{name}</p>
                <p className="cardPrice">{`US $${price}`}</p>
                <p className="cardTimeLeft">{deadline > 0 ? `${Math.floor(deadline/(1000*60*60*24))}d ${Math.floor((deadline/(1000*60*60))%24)}h` : 'To be closed'}</p>
            </div>
        </div>
    )
}