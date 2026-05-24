import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";

export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "/api";

export const http = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15000,
});

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("knowledge_ai_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError<{ message?: string }>) => {
    const message = error.response?.data?.message || error.message || "请求失败";
    return Promise.reject(new Error(message));
  },
);
