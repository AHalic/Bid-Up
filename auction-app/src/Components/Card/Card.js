import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

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
    const [auctContract, setAuctContract] = useState("")
    const [seller, setSeller] = useState("")
    

    const navigate = useNavigate()

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

            const auctClose = await auctionContract.close()
            setClose(auctClose)

            var closedDate = await auctionContract.closeDate()
            closedDate = new Date(Number(closedDate))
            setCloseDate(closedDate.toLocaleDateString('pt-br'))
            
            const auctEndDate = await auctionContract.endTime()
            const endDate = new Date(Number(auctEndDate))
            const today = new Date()
            setDeadline(endDate - today)
            
            const bidder = await auctionContract.highestBidder()
            setHighestBidder(bidder)

            const owner = await auctionContract.seller()
            setSeller(owner)
        }
        getData()

    }, [auctionAddress, signer])


    function handleClick() {
        if (isMyBid && close && highestBidder === signer._address) {

            swal("Are you ready to pay?", {
                buttons: ['Not yet...', 'Yes!'],
                })  
                .then((value) => {
                    if (value) {
                        swal({
                                title: "Are you sure?",
                                icon: "warning",
                                buttons: ['Cancel', 'Yes, pay!'],
                                dangerMode: true,
                            })
                            .then(async (willDelete) => {
                                if (willDelete) {
                                    const options = {value: String(price)}
                                    Promise.all([
                                        auctContract.pay(options)

                                    ]).then(() => {
                                        swal({
                                            title: 'Your payment is in process, please wait',
                                            icon: 'info',
                                            button: false,
                                            closeOnClickOutside: false,
                                        })
                                        auctContract.on("Sold", (from, valueSent, valueReceived) => {
                                            swal({
                                                title: `You paid successfully! The owner will contact you soon`,
                                                icon: 'success',
                                            }).then(() => {
                                                window.location.reload(true);
                                            })
                                        })
                                    }).catch((err) => {
                                        console.log(err);
                                        swal({
                                            title: `Something went wrong, please try again ${err}`,
                                            icon: 'error',
                                        })
                                    })
                                }
                            });
                    }
                });

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
                <p className={`cardPrice ${isMyBid && highestBidder !== signer._address ? 'cardPriceNot': 'cardPriceMy'}`}
                >{`eth $${price} ${isMyBid && highestBidder !== signer._address ? ' not yours!': ''}`}</p>
                {close ? 
                    <p className="cardTimeLeft">{`Closed on ${closeDate}`}</p> 
                : 
                    <p className="cardTimeLeft">{deadline > 0 ? `${Math.floor(deadline/(1000*60*60*24))}d ${Math.floor((deadline/(1000*60*60))%24)}h` : 'To be closed'}</p>
                }
            </div>
        </div>
    )
}