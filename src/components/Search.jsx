import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { FaBars, FaPlay, FaSearch } from "react-icons/fa";
import apiHelper from "../utils/apiHelper";
import debounce from "lodash.debounce"; // Optional, for optimizing search requests

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchSongs, setSearchSongs] = useState([]);
  const [searchAlbums, setSearchAlbums] = useState([]);
  const [searchArtists, setSearchArtists] = useState([]);
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
    setSearchTerm(value);

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
  }, 300); // Debounce to limit frequent API calls
  const handleSearchClick = async () => {
    try {
      setSuggestions({ songs: [], albums: [], artists: [] });

      const data = await apiHelper(
        `/api/song/search`,
        "GET",
        null,
        {},
        { search: searchTerm }
      );
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
          <div className="relative mb-6">
            <div className="flex items-center">
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
                        className="flex items-center px-4 py-2 hover:bg-gray-800 cursor-pointer"
                        onClick={() => setSearchTerm(song.title)} // Set search term to clicked suggestion
                      >
                        <img
                          src={
                            song.album?.coverImage || "default-cover-image.jpg"
                          }
                          alt="Album Cover"
                          className="w-12 h-10 mr-3" // Adjust size and margin for alignment
                        />
                        <div className="text-white text-sm">Song,{song.title}</div>
                        <div className="text-gray-400">
                          ,{" "}
                          {song.artists
                            ?.map((artist) => artist.name)
                            .join(", ")}{" "}
                          {/* Multiple artists */}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Albums Suggestions */}
                {suggestions.albums.length > 0 && (
                  <div>
                    {suggestions.albums.map((album) => (
                      <div
                        key={album._id}
                        className="flex items-center px-4 py-2 hover:bg-gray-800 cursor-pointer"
                        onClick={() => setSearchTerm(album.title)}
                      >
                        <img
                          src={album?.coverImage || "default-cover-image.jpg"}
                          alt="Album Cover"
                          className="w-12 h-10 mr-3" // Adjust size and margin for alignment
                        />
                        <div className="text-white text-sm">Album,{album.title}</div>
                        <div className="text-gray-400">  ,{" "}
                          {album.artist.name}
                          </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Artists Suggestions */}
                {suggestions.artists.length > 0 && (
                  <div>
                    {suggestions.artists.map((artist) => (
                      <div
                        key={artist._id}
                        className="flex items-center px-4 py-2 hover:bg-gray-800 cursor-pointer"
                        onClick={() => setSearchTerm(artist.name)}
                      >
                         <img
                          src={artist?.profilePic || "default-cover-image.jpg"}
                          alt="Album Cover"
                          className="w-12 h-10 mr-3" // Adjust size and margin for alignment
                        />
                        <div className="text-white text-sm"> Artist,{artist.name} </div>
                       
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Songs Section */}
          <div>
            <p className="text-2xl font-bold mt-10 mb-4"></p>
            <div className="results-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchSongs &&
                searchSongs.map((song) => (
                  <div
                    key={song._id}
                    className="bg-gray-500 rounded-lg overflow-hidden transform transition-transform duration-200 hover:scale-105 group"
                  >
                    <div className="relative">
                      <img
                        src={
                          song.album?.coverImage || "default-cover-image.jpg"
                        }
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
                      <button className="text-white text-lg">
                        {song.title}
                      </button>
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
              {searchAlbums &&
                searchAlbums.map((album) => (
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
                      <button className="text-white text-lg">
                        {album.title}
                      </button>
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
              {searchArtists &&
                searchArtists.map((artist) => (
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
                      <button className="text-white text-lg">
                        {artist.name}
                      </button>
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
