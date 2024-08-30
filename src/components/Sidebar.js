import React, { useState } from "react";
import { Link } from "react-router-dom";

const logoPath = process.env.PUBLIC_URL + "/logo1.png";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      {/* Toggle button for mobile view */}
      <div className="bg-black px-4 py-2 flex justify-between items-center md:hidden">
        <button
          className="text-white focus:outline-none"
          onClick={toggleMenu}
          aria-controls="menu"
          aria-expanded={isOpen}
        >
          <span className="sr-only">Toggle Menu</span>
          {/* Icon for the toggle button */}
          {isOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          )}
        </button>
      </div>

      {/* Sidebar Content */}
      {isOpen && (
        <div className="flex flex-col items-center mt-6 md:block">
          <img src={logoPath} alt="Warble Logo" className="w-32 h-32 mb-6" />
          <ul className="space-y-5">
            <li>
              <Link to="/" className="text-lg hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link to="/profile" className="text-lg hover:underline">
                Profile
              </Link>
            </li>
            <li>
              <Link to="/settings" className="text-lg hover:underline">
                Settings
              </Link>
            </li>
            <li>
              <Link to="/search" className="text-lg hover:underline">
                Search
              </Link>
            </li>
          </ul>
        </div>
      )}

      {/* Toggle Button for Desktop */}
      <div className="hidden md:flex justify-center mt-4">
        <button
          className="text-white focus:outline-none"
          onClick={toggleMenu}
          aria-controls="menu"
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
