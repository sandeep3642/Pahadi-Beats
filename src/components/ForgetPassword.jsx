import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiHelper from "../utils/apiHelper"; // Assume this is your custom API helper for making HTTP requests
import Spinner from "./Spinner";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State for loading spinner
  const navigate = useNavigate();

  // Capture the current domain
  const domain = window.location.origin;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Show spinner while loading

    // Use toast.promise to manage spinner and toast states
    toast.promise(
      apiHelper("/api/user/forgotPassword", "POST", { email, domain })
        .then((response) => {
          if (response && response.status === 200) {
            toast.success(response.message || "A password reset link has been sent to your email.");
            setTimeout(() =>{
              navigate("/login")
          },2000); // Redirect to login page after success
          } else {
            toast.error(response.error || "An error occurred while requesting a password reset.");
          }
        })
        .catch((error) => {
          console.error("Error requesting password reset:", error);
          toast.error("An error occurred. Please try again.");
        })
        .finally(() => {
          setIsLoading(false); // Hide spinner after toast is displayed
        }),
      {
        pending: "Processing your request...",
        success: "Request processed successfully 👌",
        error: "An error occurred 🤯"
      }
    );
  };

  return (
    <div className="bg-gradient-to-r from-black to-purple-900 min-h-screen flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-gray-800">
        <h1 className="text-2xl font-bold mb-4 text-white text-center">Forget Password</h1>
        <p className="text-white mb-6 text-center">
          Enter your email address to receive a password reset link.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-left block text-white mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg mt-4 w-full"
            disabled={isLoading} // Disable button when loading
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-400">
            Remembered your password?
            <Link to="/login" className="text-purple-500 underline ml-2">
              Login
            </Link>
          </p>
        </div>
      </div>

      {isLoading && <Spinner />} {/* Display spinner when loading */}

      <ToastContainer /> {/* Add ToastContainer to render toasts */}
    </div>
  );
};

export default ForgetPassword;
