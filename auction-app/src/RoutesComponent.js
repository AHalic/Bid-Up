import React, { useState, useEffect } from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import { ethers } from 'ethers';

import auction from './Services/keys/auctionKeys';
import Home from './Components/Home/Home';
import Product from './Components/Product/Product';
import { loginMetaMask } from './Services/metamask';

const RoutesComponent = () => {
    const [auctions, setAuctions] = useState("")
    const [signer, setSigner] = useState("");
    const [auctFactory, setAuctFactory] = useState("");

    const getAuctions = async () => {
        if (auctFactory) {
            const data = await auctFactory.getAuctions()

            setAuctions(data);
        } else {
            setAuctions(false)
        }
    }
    useEffect(() => {
        getAuctions()
    }, [auctFactory])

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
                    auctFactory={auctFactory} setAuctFactory={setAuctFactory} />} path="/" />
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