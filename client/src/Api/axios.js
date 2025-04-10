import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "https://evangadi-forum-blue.onrender.com",
  // baseURL: "http://localhost:2017/api",
});

export default axiosInstance;
