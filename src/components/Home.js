import React, { useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Songs from "./Songs";
import Artist from "./Artist";
import Album from "./Album";
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa"; // Import hamburger and close icons

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to handle sidebar visibility

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <Sidebar
        className={`fixed inset-0 z-40 bg-gray-900 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:relative md:translate-x-0 md:w-1/4 lg:w-1/5`}
      />

      {/* Main content area */}
      <section className="flex-1 bg-purple-1000 p-4 sm:p-6 text-white">
        {/* Header with hamburger menu */}
        <Header>
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </Header>

        {/* Popular Artist Section */}
        <div className="mt-4 sm:mt-6 flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-2xl font-semibold">Popular Artist</h2>
          <Link
            to="/allartists"
            className="text-purple-500 hover:underline text-sm sm:text-base"
          >
            Show all
          </Link>
        </div>
        <Artist />

        {/* Albums Section */}
        <div className="mt-4 sm:mt-6 flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-2xl font-semibold">Albums</h2>
          <Link
            to="/allabums"
            className="text-purple-500 hover:underline text-sm sm:text-base"
          >
            Show all
          </Link>
        </div>
        <Album />

        {/* Songs Section */}
        <div className="mt-4 sm:mt-6 flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-2xl font-semibold">Songs</h2>
          <Link
            to="/allsongs"
            className="text-purple-500 hover:underline text-sm sm:text-base"
          >
            Show all
          </Link>
        </div>
        <Songs />

        {/* Footer Section */}
        <Footer />
      </section>
    </div>
  );
};

export default Home;
