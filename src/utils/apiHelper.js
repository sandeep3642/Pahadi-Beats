// src/utils/apiHelper.js
import axios from 'axios';

const BASE_URL = 'https://warble-backend-api.onrender.com';

const apiHelper = async (endpoint, method = 'GET', body = null, headers = {}, params = {}) => {
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
    console.error('API Request failed:', error);
    if (error.response) {
      throw new Error(`HTTP error! Status: ${error.response.status}, Message: ${error.response.data.message || error.message}`);
    } else {
      throw new Error(`Network error! ${error.message}`);
    }
  }
};

export default apiHelper;
