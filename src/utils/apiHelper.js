// src/utils/apiHelper.js
import axios from 'axios';
import { toast } from "react-toastify"; // Import toast and ToastContainer from react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import the toastify CSS

const BASE_URL = window.location.hostname.includes('localhost')
? 'http://localhost:5000'  // Use local backend for development
: 'https://warble-backend-api.onrender.com';  // Use production backend

const apiHelper = async (endpoint, method = 'GET',  body = null, headers = {}, params = {}) => {
  try {
    // Set up default headers
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    };

    // Configure Axios request options
    const options = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: defaultHeaders,
      params, // Query parameters
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

    // Return the response data
    return response.data;
  } catch (error) {
    // Handle and log errors
    console.error('API Request failed:', error?.response?.data?.error);
    if (error?.response) {
      toast.error(error?.response?.data?.error); // Error toast with server message
    } else {
      throw new Error(`Network error! ${error.message}`);
    }
  }
};

export default apiHelper;
