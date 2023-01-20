import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { style, StyledTextField } from './style';
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";

import CryptoJS from 'crypto-js';

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

import { supabase } from "../../Services/supabaseClient";


function ButtonAdd ({signer, auctFactory}) {
    const [open, setOpen] = React.useState(false);
    const [selectedFile, setSelectedFile] = useState(null)
    const [deadline, setDeadline] = React.useState(Date());
    const [title, setTitle] = useState("")
    const [initialBid, setInitialBid] = useState(0)

    const navigate = useNavigate()

    const handleDeadline = (newValue) => {
      setDeadline(newValue);
    };
  
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleTitle = (event) => setTitle(event.target.value);
    const handleInitialBid = (event) => setInitialBid(event.target.value);


    async function handleSubmit(event) {
        event.preventDefault();
        const today = (new Date()).getTime()
        const dateEnd = (new Date(deadline)).getTime()

        const reader = new FileReader();
        

        reader.onload = async (event) => {
           const dataFile = event.target.result;
           const encrypted = CryptoJS.SHA256( dataFile );
           
           const { data, error } = await supabase
               .storage
               .from('avatars')
               .upload(`images/${encrypted}`, selectedFile, {
                   cacheControl: '3600',
                   upsert: false
               })
           
           
           if (error) {
             console.log(error);
           }
   
           const url = `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/avatars/${data.path}`
   
           Promise.all([
               auctFactory.createAuction(signer._address, String(initialBid), title, today, dateEnd, url)
           ]).then(() => {
               swal({
                   title: 'Your auction is in process, please wait',
                   icon: 'info',
                   button: false,
                   closeOnClickOutside: false,
               })
               auctFactory.on("AuctionCreated", (from, auction, name, createdAt) => {
                   swal({
                       title: `Your auction is created! ${name} is ready to receive bids`,
                       icon: 'success',
                   }).then(() => {
                       handleClose()
                       navigate('/auctions')
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
        };
        reader.readAsBinaryString(selectedFile);
    
        

    }

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
                    <form className="formModal" onSubmit={handleSubmit}>
                        <div className="leftColumn">
                            <Dropzone onFileUploaded={setSelectedFile}/>
                            <Button type='submit' style={style.send}>SEND</Button>
                        </div>
                        <div className="rightColumn">
                            <StyledTextField id="outlined-basic" label="Product title" variant="outlined" 
                                size='small' onChange={handleTitle} required/>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DesktopDatePicker
                                    label="Deadline *"
                                    inputFormat="MM/DD/YYYY"
                                    value={deadline}
                                    onChange={handleDeadline}
                                    renderInput={(params) => <StyledTextField {...params} />}
                                    required
                                    />
                            </LocalizationProvider>
                            <StyledTextField id="outlined-basic" label="Initial bid" variant="outlined" size='small' 
                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} onChange={handleInitialBid} required/>
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
                                <ButtonAdd signer={signer} auctFactory={auctFactory} />
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
                                    <ButtonAdd signer={signer} auctFactory={auctFactory} />
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
                            <ButtonAdd signer={signer} auctFactory={auctFactory} />
                        </div>
                    : null}
                    {openAuct === false || closeAuct === false ? 
                            <p className="titleHome">Login to start!</p>
                    : null}
                    
                </div>

        </div>
    );
}