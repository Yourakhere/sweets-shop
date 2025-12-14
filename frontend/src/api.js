import axios from "axios";

export const api = axios.create({
  baseURL: "https://your-sweets-shop-backend.vercel.app/api",
});

api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

