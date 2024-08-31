import React, { useState } from "react";
import Footer from "./Footer";
import Songs from "./Songs";
import Artist from "./Artist";
import Album from "./Album";
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import Header from "./Header";

const Home = () => {
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

        {/* Content area */}
        <div className="flex-1 p-4 sm:p-6 text-white">
          {/* Content sections */}
          <Header/>
          <SectionWithLink title="Popular Artist" linkTo="/allartists">
            <Artist />
          </SectionWithLink>

          <SectionWithLink title="Albums" linkTo="/allalbums">
            <Album />
          </SectionWithLink>

          <SectionWithLink title="Songs" linkTo="/allsongs">
            <Songs />
          </SectionWithLink>

          {/* Footer Section */}
          <Footer />
        </div>
      </main>
    </div>
  );
};

const SectionWithLink = ({ title, linkTo, children }) => (
  <div className="mt-4 sm:mt-6">
    <div className="flex justify-between items-center mb-4 sm:mb-6">
      <h2 className="text-lg sm:text-2xl font-semibold">{title}</h2>
      <Link to={linkTo} className="text-purple-500 hover:underline text-sm sm:text-base">
        Show all
      </Link>
    </div>
    {children}
  </div>
);

export default Home;