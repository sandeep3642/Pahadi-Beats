import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = window.location.hostname.includes('localhost')
  ? 'http://localhost:5000'  // Use local backend for development
  : 'https://warble-backend-api.onrender.com';  // Use production backend

const apiHelper = async (endpoint, method = 'GET', body = null, additionalHeaders = {}, params = {}, isBlob = false) => {
  try {
    // Ensure the method is a string and convert it to uppercase
    method = typeof method === 'string' ? method.toUpperCase() : 'GET';

    // Retrieve token and sessionId
    const token = localStorage.getItem('token');
    const sessionId = document.cookie
      .split('; ')
      .find(row => row.startsWith('sessionId='))
      ?.split('=')[1];

    // Set up default headers
    const defaultHeaders = {
      'Content-Type': body instanceof FormData ? 'multipart/form-data' : 'application/json',
      Authorization: `Bearer ${token}`,
      sessionId: sessionId,
      ...additionalHeaders,
    };

    // Configure Axios request options
    const options = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: defaultHeaders,
      params, // Query parameters
      responseType: isBlob ? 'blob' : 'json', // Set response type to 'blob' for downloads
    };

    // Check if the request body is of type FormData
    if (body instanceof FormData) {
      options.data = body;
      // Remove 'Content-Type' header to allow Axios to set it correctly
      delete options.headers['Content-Type'];
    } else if (body) {
      options.data = body;
    }

    // Make the API request using Axios
    const response = await axios(options);

    // Return the full response for blob downloads
    if (isBlob) return response;
    
    // Return the response data for regular requests
    return response.data;

  } catch (error) {
    // Handle and log errors
    console.error('API Request failed:', error?.response?.data?.error || error.message);
    
    if (error?.response) {
      toast.error(error?.response?.data?.error || "An error occurred."); // Error toast with server message

      // Redirect to login if session is expired
      if (error.response.data.error === "Session expired, Please login again!") {
        setTimeout(() => {
          window.location.assign('/login'); // Corrected to use `assign` method
        }, 1000);
      }
    } else {
      // Network or unknown errors
      toast.error(`Network error! ${error.message}`); // Error toast with network message
    }
    
    throw error; // Re-throw the error after handling
  }
};

export default apiHelper;
