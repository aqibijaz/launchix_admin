/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance } from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const { Clerk } = window as any;
      
      if (Clerk && Clerk.session) {
        const token = await Clerk.session.getToken();
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error("Error getting auth token:", error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const { Clerk } = window as any;
      if (Clerk) {
        await Clerk.signOut();
        window.location.href = "/sign-in";
      }
    }
    return Promise.reject(error);
  }
);