import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import Spinner from "./Spinner"; // Import the Spinner component
import { toast, ToastContainer } from "react-toastify"; // Import toast and ToastContainer from react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import the toastify CSS
import apiHelper from "../utils/apiHelper";
import { FcGoogle } from "react-icons/fc";

const logoPath = process.env.PUBLIC_URL + "/PB.png";

const Login = () => {
  const [loginMethod, setLoginMethod] = useState("email"); // "email" or "phone"
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State for loading spinner
  const [deviceInfo, setDeviceInfo] = useState({}); // State to store device info

  // Function to get device information including location
  const getDeviceInfo = () => {
    const info = {
      browser: navigator.userAgent,
      device: navigator.userAgentData?.platform || "Unknown Device",
      latitude: null,
      longitude: null,
      location: null,
    };

    // Check if geolocation is supported
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          info.latitude = position.coords.latitude;
          info.longitude = position.coords.longitude;
          console.log("Device Info with Location:", info);
          setDeviceInfo(info); // Update state with device info
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      toast.error("Geolocation is not supported by this browser."); // Show error toast
    }

    return info;
  };

  // Check for location access when the component mounts
  useEffect(() => {
    getDeviceInfo(); // Get device info including location
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Show spinner
    const loginData = {
      ...(loginMethod === "email" ? { email, password } : { phoneNumber, password }),
      deviceInfo: deviceInfo, // Include device info in login data
    };
    try {
      if (deviceInfo.latitude != null && deviceInfo.longitude != null) {
        const response = await apiHelper("/api/user/login", "POST", loginData);
        if (response && response.status === 200) {
          localStorage.setItem("token", response.data.token);
          document.cookie = `sessionId=${response.data.sessionId}; path=/`; // Store session ID in cookie
          toast.success(response.message || "Login successful!");
          window.location.href = "/"; // Redirect to the home page
        } else {
          toast.error(response.error || "An error occurred during login. Please try again.");
        }
      } else {
        toast.error("Location access denied. Please allow location access and try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false); // Hide spinner
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to the backend Google login route
    const BASE_URL = window.location.hostname.includes('localhost')
    ? 'http://localhost:5000'  // Use local backend for development
    : 'https://warble-backend-api.onrender.com';  // Use production backend

    // Redirect to the backend Google login route
    window.location.href = `${BASE_URL}/api/user/auth/google`;
  };

  return (
    <div className="bg-gradient-to-r from-black to-purple-900 min-h-screen flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-gray-800">
        <img
          src={logoPath}
          alt="Warble Logo"
          className="w-32 h-32 mx-auto mb-6"
        />
        <h1 className="text-2xl font-bold mb-4 text-white text-center">Login</h1>
        <p className="text-white mb-6 text-center">Sign In to your account</p>

        <div className="flex justify-center mb-4">
          <button
            className={`text-left px-4 py-2 ${
              loginMethod === "email"
                ? "bg-purple-600 text-white"
                : "bg-gray-800 text-gray-400"
            } rounded-l-lg`}
            onClick={() => setLoginMethod("email")}
          >
            Email
          </button>
          <button
            className={`text-left px-4 py-2 ${
              loginMethod === "phone"
                ? "bg-purple-600 text-white"
                : "bg-gray-800 text-gray-400"
            } rounded-r-lg`}
            onClick={() => setLoginMethod("phone")}
          >
            Phone
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {loginMethod === "email" ? (
            <div>
              <label className="text-left block text-white mb-2">Email</label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              />
            </div>
          ) : (
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-800">
              <PhoneInput
                international
                defaultCountry="IN"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e)}
                placeholder="Mobile Number"
                className="w-full p-3 rounded border-none outline-none text-black"
              />
            </div>
          )}

          <div>
            <label className="text-left block text-white mb-2">Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
            />
          </div>

          <button
            type="submit"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg mt-4 w-full"
            disabled={isLoading} // Disable button when loading
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <button
          onClick={handleGoogleLogin}
          className="bg-white text-black px-6 py-3 rounded-lg mt-4 w-full flex items-center justify-center"
        >
          <FcGoogle className="mr-2" />
          Login with Google
        </button>

        <div className="text-center mt-6">
          <p className="text-gray-400">
            Don't have an account?
            <Link to="/register" className="text-purple-500 underline ml-2">
              Register
            </Link>
          </p>
          <p className="text-gray-400 mt-4">
            Forgot your password?
            <Link to="/forgot-password" className="text-purple-500 underline ml-2">
              Click here
            </Link>
          </p>
        </div>
      </div>
      {isLoading && <Spinner />} {/* Show spinner when loading */}
      <ToastContainer /> {/* Add ToastContainer to render toasts */}
    </div>
  );
};

export default Login;
