import axios from "axios";
import { store } from "../app/store";

export const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});
