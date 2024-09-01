import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const resetId = new URLSearchParams(location.search).get("resetId");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
        const BASE_URL = window.location.hostname.includes('localhost')
        ? 'http://localhost:5000'  // Use local backend for development
        : 'https://warble-backend-api.onrender.com';  // Use production backend
      const response = await axios.post(
        `${BASE_URL}/api/user/resetPassword`,
        { password },
        {
          headers: {
            Authorization: `Bearer ${resetId}`,
          },
        }
      );

      // Notify user on success
      toast.success(response?.data?.message || "Password reset successfully!");
      navigate("/login"); // Redirect to login page after success
    } catch (err) {
      setError(err?.response?.data?.error || "Something went wrong!" + err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center">Reset Password</h2>

        {error && <p className="mb-4 text-red-500">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 font-medium text-white">
              New Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-2 border border-gray-300 rounded text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block mb-2 font-medium text-white">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full p-2 border border-gray-300 rounded text-black"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full p-2 mt-4 text-white bg-purple-600 rounded hover:bg-purple-700"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
