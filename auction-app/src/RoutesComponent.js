import React, { useState, useEffect } from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import { ethers } from 'ethers';

import Home from './Pages/Home/Home';
import Product from './Pages/Product/Product';
import Bids from './Pages/Bids/Bids';
import { loginMetaMask } from './Services/metamask';

const RoutesComponent = () => {
    const [auctions, setAuctions] = useState([])
    const [history, setHistory] = useState([])
    const [signer, setSigner] = useState("");
    const [auctFactory, setAuctFactory] = useState("");

    useEffect(() => {
        const getAuctions = async () => {
            if (auctFactory) {
                const data = await auctFactory.getAuctions()
                const historyData = await auctFactory.getUserHistory(signer._address)
    
                setHistory(historyData)
                setAuctions(data)
            } else {
                setHistory(false)
                setAuctions(false)
            }
        }
        getAuctions()
    }, [auctFactory, signer._address])

    useEffect(() => {
        const checkMetaMask = async () => {
            const isMetaMaskConnected = async () => {
                const provider = new ethers.providers.Web3Provider(window.ethereum, "goerli");
                const accounts = await provider.listAccounts();
                return accounts.length > 0;
            }

            await isMetaMaskConnected().then((connected) => {
                if (connected) {
                    loginMetaMask(setAuctFactory, setSigner)
                }
            });
        }            
        checkMetaMask()
    }, [])

    return (
        <BrowserRouter>
            {/* Para ter diversas rotas, é preciso usar a tag Routes */}
            <Routes>
                {/* path: endereço em que a componente será visivel */}
                <Route element={<Home signer={signer} setSigner={setSigner} 
                    auctFactory={auctFactory} setAuctFactory={setAuctFactory}
                    auctions={auctions} isHome={true} title={'OPEN AUCTIONS'} />} path="/" />
                <Route element={<Bids signer={signer} setSigner={setSigner} 
                    auctFactory={auctFactory} setAuctFactory={setAuctFactory}/>} path="/bids" />
                <Route element={<Home signer={signer} setSigner={setSigner}
                    auctFactory={auctFactory} setAuctFactory={setAuctFactory}
                    auctions={history} isHome={false} title={'MY SHOPPING'} />} path="/shopping" />
                {auctions ?
                    auctions.map((address) => {
                        return (<Route key={address} element={<Product address={address} signer={signer} setSigner={setSigner}
                            auctFactory={auctFactory} setAuctFactory={setAuctFactory} />} path={`/product/${address}`} />)
                    })
                : null
                }
            </Routes>
        </BrowserRouter>
    );
}


export default RoutesComponent;