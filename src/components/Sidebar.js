import React from "react";
import { Link } from "react-router-dom";

const logoPath = process.env.PUBLIC_URL + "/logo1.png";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-purple-800  p-5 text-white h-full flex flex-col items-center transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}
    >
      {/* Close button for mobile view */}
      <button
        className="md:hidden text-white mb-6"
        onClick={toggleSidebar}
        aria-label="Close sidebar"
      >
        ✕
      </button>

      <img src={logoPath} alt="Warble Logo" className="w-32 h-32 mx-auto mb-6" />
      
      <ul className="space-y-5">
        <li>
          <Link to="/" className="text-lg hover:underline" onClick={toggleSidebar}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/profile" className="text-lg hover:underline" onClick={toggleSidebar}>
            Profile
          </Link>
        </li>
        <li>
          <Link to="/settings" className="text-lg hover:underline" onClick={toggleSidebar}>
            Settings
          </Link>
        </li>
        <li>
          <Link to="/search" className="text-lg hover:underline" onClick={toggleSidebar}>
            Search
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
