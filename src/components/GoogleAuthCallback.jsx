import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Updated import
import { toast } from "react-toastify";

const GoogleAuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Updated hook

  useEffect(() => {
    // Extract the token from URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const sessionId =  queryParams.get("sessionId");
    if (token) {
      // Store the token in localStorage
      localStorage.setItem("token", token);
      document.cookie = `sessionId=${sessionId}; path=/`; 
      toast.success("Login successful!");
      navigate("/"); // Updated navigation method
    } else {
      toast.error("Failed to authenticate with Google.");
      navigate("/login"); // Updated navigation method
    }
  }, [location, navigate]); // Updated dependency array

  return (
    <div>
      <p>Loading...</p>
    </div>
  );
};

export default GoogleAuthCallback;
