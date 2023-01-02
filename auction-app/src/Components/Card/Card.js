import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useNavigate } from 'react-router-dom';

import './Card.css'
import auction from "../../Services/keys/auctionKeys";

export default function Card({auctionAddress, signer, isMyBid}) {
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [image, setImage] = useState("")
    const [deadline, setDeadline] = useState("")
    const [closeDate, setCloseDate] = useState("")
    const [close, setClose] = useState(false)
    const [highestBidder, setHighestBidder] = useState("")
    

    const navigate = useNavigate()

    useEffect(() => {
        const getData = async () => {
            const auctionContract = new ethers.Contract(auctionAddress, auction.abi, signer)

            const auctName = await auctionContract.productName()
            setName(auctName)

            const auctPrice = await auctionContract.highestBid()
            setPrice(auctPrice)

            const auctImage = await auctionContract.imageData()
            setImage(auctImage)

            const auctClose = await auctionContract.close()
            setClose(auctClose)

            var closeDate = await auctionContract.closeDate()
            closeDate = new Date(Number(closeDate))
            setCloseDate(closeDate)

            const auctEndDate = await auctionContract.endTime()
            const endDate = new Date(Number(auctEndDate))
            const today = new Date()
            setDeadline(endDate - today)

            const bidder = await auctionContract.highestBidder()
            setHighestBidder(bidder)
            console.log(bidder, signer._address);
        }
        getData()

    }, [])

    function handleClick() {
        if (isMyBid && close && highestBidder == signer._address) {
            console.log('You won this auction');

        } else {
            navigate(`/product/${auctionAddress}`)
        }
    }


    return (
        <div className={`card ${close ? 'cardPay' : ''}`} onClick={handleClick}>
            <div className="cardImageDiv">
                <img className="cardImage" src={image} alt={`${name}`}/>
            </div>
            <div className="cardInfo">
                <p className="cardTitle">{name}</p>
                <p className={`cardPrice ${isMyBid && highestBidder != signer._address ? 'cardPriceNot': 'cardPriceMy'}`}
                >{`US $${price} ${isMyBid && highestBidder != signer._address ? ' not yours!': ''}`}</p>
                {close ? 
                    <p className="cardTimeLeft">{`Closed on ${closeDate.toLocaleDateString("en-US")}`}</p> 
                : 
                    <p className="cardTimeLeft">{deadline > 0 ? `${Math.floor(deadline/(1000*60*60*24))}d ${Math.floor((deadline/(1000*60*60))%24)}h` : 'To be closed'}</p>
                }
            </div>
        </div>
    )
}