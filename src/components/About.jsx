import React, { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import { FaBars } from "react-icons/fa";

const About = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-purple-1000">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content area */}
      <main className="flex-1 flex flex-col">
        {/* Header for Mobile View */}
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

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg text-center mx-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Pahadi Beats</h1>
            <p className="text-gray-600 mb-6">
              Discover the perfect music for every occasion with Pahadi Beats,
              available on your phone, computer, tablet, and more. Enjoy a wide
              variety of Pahadi songs, including Garhwali, Kumaoni, Himachali,
              and more, all in one app.
            </p>
            <p className="text-gray-600 mb-6">
              With millions of tracks and albums, Pahadi Beats has something for
              every mood—whether you’re driving, working out, partying, or just
              relaxing. Choose what you want to listen to, whenever you want.
            </p>
            <p className="text-gray-600 mb-6">
              Explore playlists and collections curated by your friends and
              discover new music together.
            </p>
            <Link
              to="/"
              className="inline-block bg-purple-600 text-white font-bold py-2 px-4 rounded hover:bg-purple-700 transition duration-300"
            >
              Explore Now
            </Link>
          </div>

          {/* Merchant Information */}
          <div className="bg-white rounded-lg shadow-lg p-6 mt-8 w-full max-w-lg text-left mx-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">About Us</h2>
            <p className="text-gray-600 mb-2">
              <strong>Merchant Legal Entity Name:</strong> Sandeep Ghildiyal
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Registered Address:</strong> Rishikesh, Rishikesh, Uttarakhand, PIN: 249137
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Operational Address:</strong> Rishikesh, Rishikesh, Uttarakhand, PIN: 249137
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Telephone No:</strong> 8077589187
            </p>
            <p className="text-gray-600 mb-2">
              <strong>E-Mail ID:</strong> beatsofpahad@gmail.com
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
