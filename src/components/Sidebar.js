import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaTimes,
  FaHome,
  FaUser,
  FaCog,
  FaSearch,
  FaSignOutAlt,
} from "react-icons/fa";
import { showConfirmDialog } from "../utils/confirmDialog";
import apiHelper from "../utils/apiHelper";
import { MdFileDownload, MdLock } from "react-icons/md";

const logoPath = process.env.PUBLIC_URL + "/logo1.png";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [isSubscribed, setIsSubscribed] = useState(false); // Add subscription state

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await apiHelper(
          "/api/subscription/getUserSubscription",
          "GET"
        );
        if (response.status === 200) {
          console.log(response.data, ">>>>>>>>>>>>>>>>>>>>>>");
          if (response.data[0].status === "active") {
            setIsSubscribed(true);
          }
        }
      } catch (error) {
        console.error(error.response?.data?.error || "An error occurred.");
      }
    };
    fetchSubscriptions();
  }, []);

  const handleLogout = async () => {
    const confirmed = await showConfirmDialog(
      "Logout Confirmation",
      "Are you sure you want to logout?"
    );
    if (confirmed) {
      const token = localStorage.getItem("token");
      const sessionId = document.cookie
        .split("; ")
        .find((row) => row.startsWith("sessionId="))
        .split("=")[1];
      const headers = {
        Authorization: `Bearer ${token}`,
        sessionId: sessionId,
      };
      const response = await apiHelper(
        "/api/user/logout",
        "POST",
        null,
        headers
      );
      if (response) {
        document.cookie =
          "sessionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-black text-white transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:relative md:translate-x-0`}
    >
      <div className="flex flex-col h-full">
        <div className="relative p-4">
          <div className="flex justify-center">
            <img src={logoPath} alt="Warble Logo" className="w-32 h-32" />
          </div>
          <button
            onClick={toggleSidebar}
            className="absolute top-4 right-4 text-white focus:outline-none md:hidden"
            aria-label="Close sidebar"
          >
            <FaTimes size={24} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-5 p-4 flex flex-col items-center">
            <li className="w-full">
              <Link
                to="/"
                className="text-lg hover:underline flex items-center justify-center w-full"
              >
                <FaHome className="mr-2" /> Home
              </Link>
            </li>
            <li className="w-full">
              <Link
                to="/profile"
                className="text-lg hover:underline flex items-center justify-center w-full"
              >
                <FaUser className="mr-2" /> Profile
              </Link>
            </li>
            <li className="w-full">
              <Link
                to="/settings"
                className="text-lg hover:underline flex items-center justify-center w-full"
              >
                <FaCog className="mr-2" /> Settings
              </Link>
            </li>
            <li className="w-full">
              <Link
                to="/search"
                className="text-lg hover:underline flex items-center justify-center w-full"
              >
                <FaSearch className="mr-2" /> Search
              </Link>
            </li>

            <li className="w-full">
              <button
                onClick={handleLogout}
                className="text-white py-2 px-4 rounded font-bold flex items-center justify-center w-full"
              >
                <FaSignOutAlt className="mr-2" /> Logout
              </button>
            </li>
            <li className="w-full">
              {isSubscribed ? (
                <Link
                  to="/downloaded-songs"
                  className="text-lg hover:underline flex items-center justify-center w-full"
                >
                  <div className="relative inline-block">
                    <MdFileDownload className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <p>Downloaded Songs</p>
                </Link>
              ) : (
                <Link
                  to="/buy-plans"
                  className="text-lg hover:underline flex items-center justify-center w-full"
                >
                  <div className="relative inline-block ">
                    <MdFileDownload className="w-4 h-4 md:w-5 md:h-5" />
                    <MdLock className="w-3 h-3 md:w-4 md:h-4 absolute top-2 left-2 text-red-600" />
                  </div>
                  <p>Downloaded Songs</p>
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
