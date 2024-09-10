import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { FaBars } from "react-icons/fa";
import Header from "./Header";
import apiHelper from "../utils/apiHelper";
import { Link } from "react-router-dom";

const AllArtist = () => {
  const [artists, setArtists] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const data = await apiHelper("/api/artist/getAllArtists", "GET");
        setArtists(data.data);
      } catch (error) {
        console.error("Error fetching artists:", error);
      }
    };

    fetchArtists();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-purple-1000">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main content area */}
      <main className="flex-1 flex flex-col">
        {/* Header with hamburger menu */}
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
        <Header />

        {/* Artists section */}
        <div className="flex flex-wrap justify-center gap-8 p-6 overflow-visible">
          {artists.map((artist) => (
            <div
              key={artist._id}
              className="relative flex flex-col items-center group rounded-full p-2 transition-transform transform hover:scale-105"
            >
              {/* Artist Image Container */}
              <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 bg-gray-200 rounded-full overflow-hidden relative">
                <img
                  src={artist.profilePic || "default-cover-image.jpg"}
                  alt={`Artist ${artist.name}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Background card on hover */}
              <Link to={`/aboutArtist/${artist._id}`}>
                <div className="absolute inset-0 bg-gray-500 rounded-full flex flex-col items-center justify-center p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <button aria-label={`View ${artist.name}`} className="text-white">
                    View
                  </button>
                  <span className="text-white mt-2 text-center">{artist.name}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AllArtist;
