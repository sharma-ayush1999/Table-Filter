import axios from "axios";

// Defining base API URL for global use
const baseURL = "https://intense-tor-76305.herokuapp.com/merchants";

const axiosInstance = axios.create({
  baseURL: baseURL,
});

// Exporting for global use

export default axiosInstance;
