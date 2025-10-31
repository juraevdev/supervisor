import axios from "axios";

export const API_BASE_URL = "https://supervisor-a0ki.onrender.com/"; // Backend API URL

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
