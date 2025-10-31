import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://supervisor-a0ki.onrender.com/api/v1/todos/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Har bir request oldidan tokenni qo'shish
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default apiClient;
