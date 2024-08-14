import React, { useEffect, useState } from "react";
import ProfileInfo from "../Cards/ProfileInfo";
import { useLocation, useNavigate } from "react-router-dom";
import Searchbar from "../SearchBar/Searchbar";

const Navbar = ({ handleClearSearch, onSearchNote, userInfo }) => {

  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  
  const onLogout = (e) => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = () => {
    if(searchQuery){
      onSearchNote(searchQuery)
    }
  };

  const onClearSearch = () => {
    setSearchQuery("");
    handleClearSearch()
  };



  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
      <h2 className="text-xl font-medium text-black py-2">Notes</h2>

      {location.pathname === "/login" || location.pathname === "/signup" ? (
        <></>
      ) : (
        <Searchbar
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
          onClearSearch={onClearSearch}
          handleSearch={handleSearch}
        />
      )}

      <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
    </div>
  );
};

export default Navbar;
