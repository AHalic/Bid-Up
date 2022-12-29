import React, { useState } from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import Home from './Components/Home/Home';

const RoutesComponent = () => {
    const [data, setData] = useState("")
    const [signer, setSigner] = useState("");
    const [auctFactory, setAuctFactory] = useState("");

    return (
        <BrowserRouter>
            {/* Para ter diversas rotas, é preciso usar a tag Routes */}
            <Routes>
                {/* path: endereço em que a componente será visivel */}
                <Route element={<Home data={data} setData={setData} signer={signer} setSigner={setSigner} 
                    auctFactory={auctFactory} setAuctFactory={setAuctFactory} />} path="/" />
            </Routes>
        </BrowserRouter>
    );
}


export default RoutesComponent;