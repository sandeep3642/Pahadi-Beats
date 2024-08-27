import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchProfile } from "../redux/profileSlice";
import { showConfirmDialog } from "../utils/confirmDialog";
import apiHelper from "../utils/apiHelper";

const avatar = process.env.PUBLIC_URL + "/avatar.png";

const Header = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleLogout = async () => {
    const confirmed = await showConfirmDialog(
      'Logout Confirmation',
      'Are you sure you want to logout?'
    );
    if (confirmed) {
      const token = localStorage.getItem('token');
      const sessionId = document.cookie.split('; ').find(row => row.startsWith('sessionId=')).split('=')[1]; // Retrieve sessionId from cookies
      const headers = {
        Authorization: `Bearer ${token}`,
        'sessionId': sessionId // Include sessionId in headers
      };
      const response = await apiHelper("/api/user/logout", "POST", null, headers);
      if (response) {
        document.cookie = "sessionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"; // Clear session ID cookie
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  };

  return (
    <header
      data-testid="topbar"
      aria-label="Top bar and user menu"
      className="border-2 border-rose-600 flex items-center justify-between bg-purple-1000 p-4"
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
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 font-bold"
          >
            Logout
          </button>
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
