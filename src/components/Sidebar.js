import React from "react";
import { Link } from "react-router-dom";
const logoPath = process.env.PUBLIC_URL + "/PB.png";

const Sidebar = () => {
  return (
    <div className="h-full w-64 bg-black p-5 text-white h-screen flex flex-col items-center">
      <img
        src={logoPath}
        alt="Warble Logo"
        className="w-32 h-32 mx-auto mb-6"
      />
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
  );
};

export default Sidebar;
