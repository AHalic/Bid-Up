import React from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import Home from './Components/Home/Home';

const RoutesComponent = () => {
    return (
        <BrowserRouter>
            {/* Para ter diversas rotas, é preciso usar a tag Routes */}
            <Routes>
                {/* path: endereço em que a componente será visivel */}
                <Route element={<Home />} path="/" />
            </Routes>
        </BrowserRouter>
    );
}



export default RoutesComponent;