import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';

import Header from "./../Header/Header";

export default function Home() {
    const { search } = window.location;
    const query = new URLSearchParams(search).get('s');
    const [searchQuery, setSearchQuery] = useState(query || '');

    return (
        <div>
            <Header boolSearch={true} searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
            
        </div>
    );
}