import axios from "axios"; // Close the import statement with a semicolon

// Set the default base URL for all axios requests
axios.defaults.baseURL = "https://onemandobackend.onrender.com"; // Adjust URL as needed

// // Set the default Authorization header, replace AUTH_TOKEN with your actual token
// axios.defaults.headers.common["Authorization"] = `Bearer ${AUTH_TOKEN}`; // Ensure AUTH_TOKEN is defined and available

// // Set the default Content-Type for POST requests
// axios.defaults.headers.post["Content-Type"] =
//   "application/x-www-form-urlencoded";

export default axios;
