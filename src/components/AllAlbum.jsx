import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { FaBars } from "react-icons/fa";
import Header from "./Header";
import apiHelper from "../utils/apiHelper";
import { Link } from "react-router-dom";

const AllAlbum = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const data = await apiHelper("/api/album/getAllAlbums", "GET");
        setAlbums(data.data);
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    };

    fetchAlbums();
  }, []);

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
       <div className="flex overflow-x-auto gap-4 p-4">
      {albums.map((album) => (
        <div
          key={album._id}
          className="relative flex flex-col items-center group p-2 transition-transform transform hover:scale-105"
        >
          {/* Album Image Container */}
          <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 bg-gray-200 overflow-hidden relative">
            <img
              src={album.coverImage || "default-cover-image.jpg"}
              alt={`Album ${album.title}`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Background card on hover */}
          <Link to={`/about-album/${album._id}`}>
            <div className="absolute inset-0 bg-gray-500 flex flex-col items-center justify-center p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <button
                aria-label={`Play ${album.title}`}
                className="bg-purple-1000 rounded-full p-2 cursor-pointer hover:bg-purple-700"
              ></button>
              <span className="text-white mt-2 text-center">{album.title}</span>
            </div>
          </Link>
        </div>
      ))}
    </div>
      </main>
    </div>
  );
};



export default AllAlbum;
