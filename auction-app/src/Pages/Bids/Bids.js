import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { style, StyledTextField } from './style';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import '../../Pages/Home/Home.css';
import Header from "../../Components/Header/Header";
import Card from "../../Components/Card/Card";
import auction from "../../Services/keys/auctionKeys";
import Dropzone from "../../Components/Dropzone/Dropzone";


function ButtonAdd ({setSelectedFile, date, setDate}) {
    const [open, setOpen] = React.useState(false);

    const handleChange = (newValue) => {
      setDate(newValue);
    };
  
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Button onClick={handleOpen} style={style.button}>NEW +</Button>
            <Modal
                style={style.modal}
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box style={style.box}>
                    <form className="formModal">
                        <div className="leftColumn">
                            <Dropzone onFileUploaded={setSelectedFile}/>
                            <Button type='submit' style={style.send}>SEND</Button>
                        </div>
                        <div className="rightColumn">
                            <StyledTextField id="outlined-basic" label="Product title" variant="outlined" size='small'/>
                            {/* <StyledTextField id="outlined-basic" label="Final date" variant="outlined" size='small'/> */}
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DesktopDatePicker
                                    label="Deadline"
                                    inputFormat="MM/DD/YYYY"
                                    value={date}
                                    onChange={handleChange}
                                    renderInput={(params) => <StyledTextField {...params} />}
                                    />
                            </LocalizationProvider>
                            <StyledTextField id="outlined-basic" label="Initial bid" variant="outlined" size='small' inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}/>
                        </div>
                    </form>
                </Box>
            </Modal>
        </div>
    )
} 

export default function Bids({signer, setSigner, auctFactory, setAuctFactory, auctions, isBid, title1, title2}) {
    const [openAuct, setOpenAuct] = useState("")
    const [closeAuct, setCloseAuct] = useState("")
    const [selectedFile, setSelectedFile] = useState(null)
    const [date, setDate] = React.useState(Date());

    useEffect(() => {
        // Get array of auctions    
        const getAuctionsInteracted = async () => {
            if (auctFactory) {
                var openData = []
                var closeData = []
                await Promise.all(auctions.map(async (address) => {
                    const auctionContract = new ethers.Contract(address, auction.abi, signer)
                    const close = await auctionContract.close()
                    const payed = await auctionContract.payed()
    
                    if (!close) {
                        openData.push(address)
                    }
                    else {
                        if (!payed)
                            closeData.push(address)
                    }
                }))
                    .then(() => {
                        setOpenAuct(openData)
                        setCloseAuct(closeData)
                    })
            } else {
                setOpenAuct(false)
                setCloseAuct(false)
            }
        }

        const getAuctionsCreated = async () => {
            if (auctFactory) {
                var openData = []
                var closeData = []
                await Promise.all(auctions.map(async (address) => {
                    const auctionContract = new ethers.Contract(address, auction.abi, signer)
                    const close = await auctionContract.close()
                    const owner = await auctionContract.seller()

                    if (owner === signer._address) {
                        if (close) {
                            openData.push(address)
                        }
                        else {
                            closeData.push(address)
                        }
                    }
                }))
                    .then(() => {
                        setOpenAuct(openData)
                        setCloseAuct(closeData)
                    })
            } else {
                setOpenAuct(false)
                setCloseAuct(false)
            }
        }

        if (auctions) {
            if (isBid) {
                getAuctionsInteracted()
            } else {
                getAuctionsCreated()
            }
        }
    }, [auctFactory, auctions, isBid, signer])

    
    return (
        <div className="homeOuter">
            <Header boolSearch={false} setSigner={setSigner} auctFactory={auctFactory} 
                setAuctFactory={setAuctFactory}/>

                <div className="homeContent">
                    {closeAuct && closeAuct.length > 0 ? 
                        <div className="innerContent">
                            <div className="titleBtn">
                                <p className="titleHome">{title1}</p> 
                                <ButtonAdd setSelectedFile={setSelectedFile} date={date} setDate={setDate} />
                            </div>
                            <div className="cardsContainer">
                                {
                                    closeAuct.map(auct => (
                                        <Card key={auct} auctionAddress={auct} signer={signer} isMyBid={isBid}/>
                                    )) 
                                }
                            </div>
                        </div>
                    : null}
                    {openAuct && openAuct.length > 0 ?
                        <div className="innerContent">
                            {closeAuct.length === 0 ? 
                                <div className="titleBtn">
                                    <p className="titleHome">{title2}</p> 
                                    <ButtonAdd />
                                </div>
                            :
                                <p className="titleHome">{title2}</p>
                            }

                            <div className="cardsContainer">
                                {
                                    openAuct.map(auct => (
                                        <Card key={auct} auctionAddress={auct} signer={signer} isMyBid={isBid}/>
                                    )) 
                                }
                            </div>
                        </div>
                    : null}
                    {closeAuct && openAuct && openAuct.length === 0 && closeAuct.length === 0 ?
                        <div className="titleBtn">
                            <p className="titleHome">{isBid ? 'You haven\'t bid yet' : 'You have no auctions yet'}</p>
                            <ButtonAdd />
                        </div>
                    : null}
                    {openAuct === false || closeAuct === false ? 
                            <p className="titleHome">Login to start!</p>
                    : null}
                    
                </div>

        </div>
    );
}