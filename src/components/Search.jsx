import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { FaBars, FaSearch } from "react-icons/fa";
import apiHelper from "../utils/apiHelper";
import debounce from "lodash.debounce"; // Optional, for optimizing search requests
import { Link, useNavigate } from "react-router-dom";

const Search = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [suggestions, setSuggestions] = useState({
    songs: [],
    albums: [],
    artists: [],
  });
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSearchChange = async (e) => {
    const value = e.target.value;

    if (value.length > 2) {
      // Fetch suggestions when input length > 2
      await fetchSuggestions(value);
    } else {
      setSuggestions({ songs: [], albums: [], artists: [] });
    }
  };
  const fetchSuggestions = debounce(async (query) => {
    try {
      const data = await apiHelper(
        `/api/song/suggestions`,
        "GET",
        null,
        {},
        { search: query }
      );
      setSuggestions({
        songs: data.data.items.songs,
        albums: data.data.items.albums,
        artists: data.data.items.artists,
      });
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  }, 300);
  // Debounce to limit frequent API calls
  const handlePlaySong = (songId) => {
    navigate("/aboutSong", {
      state: { songId },
    });
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
          <div className="relative mb-6">
            <div className="flex items-center relative">
              <input
                type="text"
                onChange={handleSearchChange}
                placeholder="Search for albums, songs, or artists..."
                className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <FaSearch className="absolute right-3 text-gray-400" />
            </div>

            {/* Suggestion Dropdown */}
            {suggestions.songs.length > 0 ||
            suggestions.albums.length > 0 ||
            suggestions.artists.length > 0 ? (
              <div className="absolute top-full left-0 w-full bg-gray-900 text-white shadow-lg mt-2 rounded-lg max-h-64 overflow-y-auto">
                {/* Songs Suggestions */}
                {suggestions.songs.length > 0 && (
                  <div>
                    {suggestions.songs.map((song) => (
                      <div
                        key={song._id}
                        onClick={() => handlePlaySong(song?._id)}
                        className="flex items-center px-4 py-2 hover:bg-gray-800 cursor-pointer w-full"
                      >
                        <img
                          src={
                            song.album?.coverImage || "default-cover-image.jpg"
                          }
                          alt="Album Cover"
                          className="w-12 h-10 mr-3" // Adjust size and margin for alignment
                        />
                        <div className="text-white text-sm flex-1 text-left">
                          <div>Song, {song.title}</div>
                          <div className="text-gray-400">
                            {song.artists
                              ?.map((artist) => artist.name)
                              .join(", ")}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Albums Suggestions */}
                {suggestions.albums.length > 0 && (
                  <div>
                    {suggestions.albums.map((album) => (
                      <Link to={`/about-album/${album._id}`}>
                        <div
                          key={album._id}
                          className="flex items-center px-4 py-2 hover:bg-gray-800 cursor-pointer"
                        >
                          <img
                            src={album?.coverImage || "default-cover-image.jpg"}
                            alt="Album Cover"
                            className="w-12 h-10 mr-3" // Adjust size and margin for alignment
                          />
                          <div className="text-white text-sm">
                            Album,{album.title}
                          </div>
                          <div className="text-gray-400">
                            {" "}
                            , {album.artist.name}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Artists Suggestions */}
                {suggestions.artists.length > 0 && (
                  <div>
                    {suggestions.artists.map((artist) => (
                      <Link to={`/aboutArtist/${artist._id}`}>
                        <div
                          key={artist._id}
                          className="flex items-center px-4 py-2 hover:bg-gray-800 cursor-pointer"
                        >
                          <img
                            src={
                              artist?.profilePic || "default-cover-image.jpg"
                            }
                            alt="Album Cover"
                            className="w-12 h-10 mr-3" // Adjust size and margin for alignment
                          />
                          <div className="text-white text-sm">
                            {" "}
                            Artist,{artist.name}{" "}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Search;
