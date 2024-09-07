import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { FaBars, FaPlay, FaSearch } from "react-icons/fa";
import apiHelper from "../utils/apiHelper";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchSongs, setSearchSongs] = useState([]);
  const [searchAlbums, setSearchAlbums] = useState([]);
  const [searchArtists, setSearchArtists] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = async () => {
    try {
      const data = await apiHelper(`/api/song/search`, "GET", null, {}, { search: searchTerm });
      setSearchSongs(data.data.items.songs);
      setSearchAlbums(data.data.items.albums);
      setSearchArtists(data.data.items.artists);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-purple-1000">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content area */}
      <main className="flex-1 flex flex-col">
        <header className="bg-black text-white p-4 flex justify-between items-center md:hidden">
          <h1 className="text-xl font-bold">Pahadi Beats</h1>
          <button
            className="text-white focus:outline-none"
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <FaBars size={24} />
          </button>
        </header>
        
        <div className="w-full text-white min-h-screen p-6">
          {/* Search Input */}
          <div className="flex items-center mb-6">
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

          {/* Songs Section */}
          <div>
          <p className="text-2xl font-bold mt-10 mb-4"></p>
            <div className="results-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchSongs && searchSongs.map((song) => (
                <div
                  key={song._id}
                  className="bg-gray-500 rounded-lg overflow-hidden transform transition-transform duration-200 hover:scale-105 group"
                >
                  <div className="relative">
                    <img
                      src={song.album?.coverImage || "default-cover-image.jpg"}
                      alt="Album Cover"
                      className="w-full h-auto object-cover"
                    />
                    <div className="absolute bottom-2 right-2 hidden group-hover:block">
                      <button
                        aria-label={`Play ${song.title}`}
                        className="bg-purple-1000 rounded-full p-2 cursor-pointer hover:bg-purple-700"
                      >
                        <FaPlay className="fill-black w-6 h-6" />
                      </button>
                    </div>
                  </div>
                  <div className="p-2">
                    <button className="text-white text-lg">{song.title}</button>
                    <div className="text-gray-400 text-sm">Song</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Albums Section */}
          <div>
          <p className="text-2xl font-bold mt-10 mb-4"></p>
            <div className="results-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchAlbums && searchAlbums.map((album) => (
                <div
                  key={album._id}
                  className="bg-gray-500 rounded-lg overflow-hidden transform transition-transform duration-200 hover:scale-105 group"
                >
                  <div className="relative">
                    <img
                      src={album.coverImage || "default-album-cover.jpg"}
                      alt="Album Cover"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  <div className="p-2">
                    <button className="text-white text-lg">{album.title}</button>
                    <div className="text-gray-400 text-sm">Album</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Artists Section */}
          <div>
          <p className="text-2xl font-bold mt-10 mb-4"></p>
            <div className="results-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchArtists && searchArtists.map((artist) => (
                <div
                  key={artist._id}
                  className="bg-gray-500 rounded-lg overflow-hidden transform transition-transform duration-200 hover:scale-105 group"
                >
                  <div className="relative">
                    <img
                      src={artist.profilePic || "default-album-cover.jpg"}
                      alt="Artist Cover"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  <div className="p-2">
                    <button className="text-white text-lg">{artist.name}</button>
                    <div className="text-gray-400 text-sm">Artist</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Search;
