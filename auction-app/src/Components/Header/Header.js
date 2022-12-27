// 
// This is the header component. It contains the logo, the search bar and the login button.
//

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';

import "./Header.css";
import logo from "../../Assets/Logo.svg";
import { RxMagnifyingGlass } from "react-icons/rx";
import { CiLogin } from "react-icons/ci";

export default function Header({boolSearch, searchQuery, setSearchQuery}) {
    const [search, setSearch] = useState("");

    const navigate = useNavigate()
    
    const onSubmit = e => {
        setSearchQuery(search)
        e.preventDefault()
        navigate(`?s=${search}`)
    };
    const handleSearchQueryChange = e => {
        setSearch(e.target.value)
    };

    return (
        <div className="header">
            {/* Logo */}
            <Link to="/">
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
            <div className="login">
                <span>
                    <CiLogin className="loginIcon" size={30}/>
                </span>
                <p className="loginText">LOGIN</p>
            </div>
        </div>
    );
}