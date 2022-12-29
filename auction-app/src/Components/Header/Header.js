// 
// This is the header component. It contains the logo, the search bar and the login button.
//

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { ethers } from "ethers";

import { loginMetaMask } from '../../Services/metamask'
import auction from "../../Services/keys/auctionKeys";

import "./Header.css";
import logo from "../../Assets/Logo.svg";
import { RxLightningBolt, RxMagnifyingGlass } from "react-icons/rx";
import { IoMdArrowDropdown } from "react-icons/io";
import { CiLogin } from "react-icons/ci";

export default function Header({boolSearch, setData, signer, setSigner, auctFactory, setAuctFactory}) {
    const [search, setSearch] = useState("");

    const navigate = useNavigate()

    // Search bar functions
    const onSubmit = async (e) => {
        e.preventDefault()
        navigate(`?s=${search}`)

        if (auctFactory) {
            const localData = await auctFactory.getAuctions()

            var newData = []
            localData.map(async (address) => {
                const auctionContract = new ethers.Contract(address, auction.abi, signer)

                const productName = await auctionContract.productName()

                if (productName.includes(search))
                    newData.push(address)
            })
            setData(newData)

        } else {
            setData(false)
        }
    };
    const handleSearchQueryChange = e => {
        setSearch(e.target.value)
    };

    // Login to metamask
    const connectHandler = async () => {
        try {
            await loginMetaMask(setAuctFactory, setSigner)
        } catch (error) {
            console.log('Something went wront: ', error);
        }

    };

    // Get array of auctions
    const getAuctions = async () => {
        if (auctFactory) {
            const data = await auctFactory.getAuctions()

            setData(data)
        } else {
            setData(false)
        }
    }

    useEffect(() => {
        getAuctions()
    }, [auctFactory])
    

    return (
        <div className="header">
            {/* Logo */}
            <Link to="/" onClick={getAuctions}>
                <img src={logo} className="logo" alt="Bid Up Logo"/>
            </Link>
            
            {/* Search bar */}
            {boolSearch ?
                <form className="search" onSubmit={onSubmit}> {/* onSubmit={onSubmit}  onChange={handleSearchQueryChange}*/}
                    <input type="text" placeholder="Search a product" className="searchInput" onChange={handleSearchQueryChange}/>
                    <button type="submit" className="searchButton">
                        <RxMagnifyingGlass className="searchIcon" size={20}/>
                    </button>
                </form>
            : null}

            {/* Login button if not logged */}
            {!auctFactory?
                <button className="login" onClick={connectHandler}>
                    <span>
                        <CiLogin className="loginIcon" size={25}/>
                    </span>
                    <p className="loginText">LOGIN</p>
                </button>
            :
            // Profile button
                <button className="profileBtn">
                    <p className="profileBtnText">
                        PROFILE
                    </p>
                    <span>
                        <IoMdArrowDropdown className="profileBtnIcon" size={20}/>
                    </span>
                </button>
            }
        </div>
    );
}