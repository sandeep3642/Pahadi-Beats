import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchProfile } from "../redux/profileSlice";


const avatar = process.env.PUBLIC_URL + "/avatar.png";

const Header = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);



  return (
    <header
      data-testid="topbar"
      aria-label="Top bar and user menu"
      className="flex items-center justify-between bg-purple-1000 p-4"
    >
      <div data-testid="topbar-content-wrapper"></div>

      {profile ? (
        <div className="flex items-center space-x-4">
          <img
            src={profile?.profilePic ?? avatar} // Assume profile has a picture field
            alt="User Profile"
            className="w-10 h-10 rounded-full"
          />
          <span className="text-white font-bold">{profile.firstName}</span>
        </div>
      ) : (
        <div className="flex space-x-4">
          <button
            className="text-gray-400 hover:text-white font-bold"
            data-testid="signup-button"
          >
            <Link to="/register">Sign up</Link>
          </button>
          <Link to="/login">
            <button
              data-testid="login-button"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 font-bold"
            >
              Log in
            </button>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
