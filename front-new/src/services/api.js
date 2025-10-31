import axios from "axios";

export const API_BASE_URL = "https://supervisor-a0ki.onrender.com/"; 


const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


export const registerUser = (data) => apiClient.post("/api/v1/accounts/register/", data);


export const RegisterVerify = (data) =>
  apiClient.post("/api/v1/accounts/register/verify/", data);



export const loginUser = (data) => apiClient.post("/api/v1/accounts/login/", data);


export const requestPasswordReset = (data) => apiClient.post("/api/v1/accounts/password/request/", data);


export const verifyPasswordReset = (data) =>
  apiClient.post("/api/v1/accounts/password/verify/", data);


export const resetPassword = (data) => apiClient.post("/api/v1/accounts/password/reset/", data);

export const ResendCode = (data) => apiClient.post("/api/v1/accounts/resend/code/", data)
