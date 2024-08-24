import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { FaSearch } from "react-icons/fa";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = async () => {
    console.log(searchTerm);
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full search-page  text-white min-h-screen p-6">
        <div className="row flex items-center mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search for albums, songs, or artists..."
            className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleSearchClick}
            className="ml-3 p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-md focus:outline-none"
          >
            <FaSearch />
          </button>
        </div>
        <div className="results-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        </div>
        <div className="results-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
      
      </div>
    </div>
  );
};

export default Search;
