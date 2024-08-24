import React, { useState } from "react";
import { Link } from "react-router-dom";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import Spinner from "./Spinner"; // Import the Spinner component
import { toast, ToastContainer } from "react-toastify"; // Import toast and ToastContainer from react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import the toastify CSS
import apiHelper from "../utils/apiHelper";

const logoPath = process.env.PUBLIC_URL + '/PahadiBeats.png';

const Login = () => {
  const [loginMethod, setLoginMethod] = useState("email"); // "email" or "phone"
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State for loading spinner

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Show spinner

    const loginData = loginMethod === "email" ? { email, password } : { phoneNumber, password };

    try {
      // Use apiHelper to handle the login request
      const response = await apiHelper("/api/user/login", "POST", loginData);
    
      if (response.data !== null) {
        localStorage.setItem("token", response.data.token);
        toast.success("Login successful!"); // Success toast
        window.location.href = "/";
      } else {
        toast.error(response.error); // Error toast with server message
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login. Please try again." + error); // Generic error toast
    } finally {
      setIsLoading(false); // Hide spinner
    }
    
  };

  return (
    <div className="bg-gradient-to-r from-black to-purple-900 min-h-screen flex flex-col justify-center items-center">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg">
        <img src={logoPath} alt="Warble Logo" className="w-32 h-32 mx-auto mb-6 rounded-full" />
        <h1 className="text-2xl font-bold mb-4 text-white">Login</h1>
        <p className="text-white mb-6">Sign In to your account</p>

        <div className="flex justify-center mb-4">
          <button
            className={`text-left px-4 py-2 ${loginMethod === "email" ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-400"} rounded-l-lg`}
            onClick={() => setLoginMethod("email")}
          >
            Email
          </button>
          <button
            className={`text-left px-4 py-2 ${loginMethod === "phone" ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-400"} rounded-r-lg`}
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
                className="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          ) : (
            <div className="flex items-center border rounded-lg px-3 py-2">
              <PhoneInput
                international
                defaultCountry="IN"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e)}
                placeholder="Mobile Number"
                className="w-full p-3 rounded bg-gray-800 border border-gray-700 border-none outline-none text-black"
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
              className="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            type="submit"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg mt-4"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-400">
            Don't have an account?
            <Link to="/register" className="text-purple-500 underline ml-2">
              Register
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
