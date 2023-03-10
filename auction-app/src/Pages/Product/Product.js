import React, { useEffect, useState } from "react";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { ethers } from "ethers";
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

import Header from "../../Components/Header/Header";
import auction from "../../Services/keys/auctionKeys";
import "./Product.css";
import "../Home/Home.css";

export default function Product({address, setSigner, signer, auctFactory, setAuctFactory}) {
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [image, setImage] = useState("")
    const [deadline, setDeadline] = useState("")
    const [close, setClose] = useState(false)
    const [payed, setPayed] = useState(false)
    const [owner, setOwner] = useState("")
    const [auctContract, setAuctContract] = useState("")

    const navigate = useNavigate()

    useEffect(() => {
        const getData = async () => {
            const auctionContract = new ethers.Contract(address, auction.abi, signer)
            setAuctContract(auctionContract)

            const auctName = await auctionContract.productName()
            setName(auctName)

            const auctPrice = await auctionContract.highestBid()
            setPrice(auctPrice)

            const auctImage = await auctionContract.imageData()
            setImage(auctImage)

            const auctClose = await auctionContract.close()
            setClose(auctClose)

            const auctEndDate = await auctionContract.endTime()
            const endDate = new Date(Number(auctEndDate))
            
            const today = new Date()
            setDeadline(endDate - today)

            const pay = await auctionContract.payed()
            setPayed(pay)

            const seller = await auctionContract.seller()
            setOwner(seller)
        }
        getData()

    }, [address, signer, price])

    function handleClickBack() {
        navigate(-1)
    }

    async function handleClickSend(e) {
        e.preventDefault()

        const bid = document.querySelector(".bidInput").value        
        const auctionContract = new ethers.Contract(address, auction.abi, signer)
        
        
        Promise.all([
            auctionContract.bid(String(bid))
        ]).then(() => {
            swal({
                title: 'Your bid is in process, please wait',
                icon: 'info',
                button: false,
                closeOnClickOutside: false,
            })
            auctionContract.on("NewBid", (from, to, value, event) => {
                swal({
                    title: 'Your bid was sent successfully, the current bid may soon be updated',
                    icon: 'success',
                }).then(() => {
                    setPrice(value)
                })
            })
        }).catch((error) => {
            console.log('Something went wrong')
            console.log(error?.error?.message)
            swal({
                title: `Something went wrong: ${error?.error?.message}}`,
                icon: 'error',
            })
        })
    }

    function handleClickIcon() {
        const today = (new Date()).getTime()
        const auctionContract = new ethers.Contract(address, auction.abi, signer)

        Promise.all([
            auctionContract.closeAuction(String(today))
        ]).then(() => {
            swal({
                title: 'Your auction will be closed soon',
                icon: 'info',
                button: false,
                closeOnClickOutside: false,
            })
            auctContract.on("AuctionClosed", (highestBid, highestBidder) => {
                swal({
                    title: `Auction closed, the highest bidder will be notificated to pay ${highestBid} wei`,
                    icon: 'success',
                }).then(() => {
                    window.location.reload(true);
                })
            })
        }).catch((err) => {
            console.log(err);
            swal({
                title: `Something went wrong, please try again ${err?.error?.message}`,
                icon: 'error',
            })
        })
    }

    return (
        <div className="homeOuter">
            <Header boolSearch={false} setSigner={setSigner} auctFactory={auctFactory} 
                setAuctFactory={setAuctFactory}/>

            <div className="homeContent">
                <div className="topContainer">
                    <HiArrowNarrowLeft className="backArrow" size={28} onClick={handleClickBack}/>
                    {owner === signer._address  && !close ?
                        <div className="closeProduct">
                            <button type="button" className="closeButton" onClick={handleClickIcon} disabled={owner !== signer._address}>CLOSE</button>
                        </div>
                    :
                        null
                    }
                </div>

                <div className="product">
                    <div className="productImageDiv">
                        <img className="productImage" src={image} alt={`${name}`}/>
                    </div>
                    <div className="productInfo">
                        <p className="productTitle">{name}</p>
                        <div className="pricingContainer">
                            <p className="productPrice">{`Current bid: wei $${price}`}</p>
                            <div className="bidInputContainer">
                                <input className="bidInput" type="number" placeholder="Enter bid (in wei)" disabled={payed}/>
                                <button className={`bidButton ${payed ? 'bidButtonDeact' : null}`}  type="button" onClick={handleClickSend} disabled={payed}>Send</button>
                            </div>
                        </div>
                        {close ? 
                            <p className="productTimeLeft">Closed</p> 
                        : 
                            <p className="productTimeLeft">{deadline > 0 ? `Time left: ${Math.floor(deadline/(1000*60*60*24))}d ${Math.floor((deadline/(1000*60*60))%24)}h` : 'To be closed'}</p>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}