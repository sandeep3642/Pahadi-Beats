import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { FaSearch } from "react-icons/fa";
import axios from "axios";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = async () => {
    try {
      const query = new URLSearchParams({
        name: searchTerm,
        lyrics: searchTerm,
        album: searchTerm,
        genre: searchTerm,
        artist: searchTerm,
        description: searchTerm,
      }).toString();
  
      const response = await fetch(`/api/song/search?${query}`);
      const data = await response.json();
  
      if (response.ok) {
        setResults(data.data);
      } else {
        console.error("Error fetching search results:", data.error);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

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
          {results.map((song) => (
            <div key={song._id} className=" p-4 rounded-lg">
              <h3 className="text-xl font-bold">{song.title}</h3>
              <p>{song.album}</p>
              <p>{song.artists.join(", ")}</p>
              <p>{song.genre}</p>
              <p>{song.description}</p>
              <p>{song.lyrics}</p>
            </div>
          ))}
        </div>
        <div className="results-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
      
      </div>
    </div>
  );
};

export default Search;
