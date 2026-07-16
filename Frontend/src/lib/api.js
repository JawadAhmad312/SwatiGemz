import axios from "axios";

const isAbsoluteUrl = (value) => /^https?:\/\//i.test(value);

export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8080"
).replace(/\/$/, "");

export const rewriteBackendUrl = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  return value
    .replace(/^https?:\/\/localhost:8080(?=\/|$)/i, API_BASE_URL)
    .replace(/^https?:\/\/127\.0\.0\.1:8080(?=\/|$)/i, API_BASE_URL);
};

export const apiUrl = (path) =>
  `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export const assetUrl = (path) => {
  if (!path) {
    return path;
  }

  if (isAbsoluteUrl(path)) {
    return rewriteBackendUrl(path);
  }

  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default api;
