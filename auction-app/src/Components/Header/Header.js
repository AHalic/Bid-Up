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
import { RxMagnifyingGlass } from "react-icons/rx";
import { IoMdArrowDropdown } from "react-icons/io";
import { CiLogin } from "react-icons/ci";

export default function Header({boolSearch, setSearchQuery, setSigner, auctFactory, setAuctFactory}) {
    const [search, setSearch] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen((prevState) => !prevState);

    const navigate = useNavigate()

    // Search bar functions
    const onSubmit = e => {
        setSearchQuery(search)
        e.preventDefault()
        navigate(`?s=${search}`)
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
    
    function handleClick() {
        setSearch('')
        setSearchQuery('')
    }

    return (
        <div className="header">
            {/* Logo */}
            <Link to="/" onClick={handleClick}>
                <img src={logo} className="logo" alt="Bid Up Logo"/>
            </Link>
            
            {/* Search bar */}
            {boolSearch ?
                <form className="search" onSubmit={onSubmit}> {/* onSubmit={onSubmit}  onChange={handleSearchQueryChange}*/}
                    <input type="text" placeholder="Search a product" value={search} className="searchInput" onChange={handleSearchQueryChange}/>
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
                <div className="dropdownProfile">
                    <button className="profileBtn" type="button" onClick={toggle}>
                        <p className="profileBtnText">
                            PROFILE
                        </p>
                        <span>
                            <IoMdArrowDropdown className="profileBtnIcon" size={20}/>
                        </span>
                    </button>
                    {dropdownOpen ? 
                        <ul className="dropdown">
                            <Link to='/bids' style={{ textDecoration: 'none' }}>
                                <div className="item">
                                    My Bids
                                </div>
                            </Link>
                            <Link to='/bids' style={{ textDecoration: 'none' }}>
                                <div className="item">
                                    My Auctions
                                </div>
                            </Link>
                            <Link to='/shopping' style={{ textDecoration: 'none' }}>
                                <div className="item">
                                    My Shoppings
                                </div>
                            </Link>
                        </ul>
                    :
                        null
                    }
                </div>
            }
        </div>
    );
}