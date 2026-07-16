import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://swatigemz.onrender.com";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const apiUrl = (path) =>
  `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export const assetUrl = (path) => {
  if (!path) {
    return path;
  }

  if (/^https?:\/\//i.test(path)) {
    return path.replace(
      /^https?:\/\/(?:localhost|127\.0\.0\.1):8080(?=\/|$)/i,
      API_BASE_URL
    );
  }

  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

export const rewriteBackendUrl = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  return value
    .replace(/^https?:\/\/localhost:8080(?=\/|$)/i, API_BASE_URL)
    .replace(/^https?:\/\/127\.0\.0\.1:8080(?=\/|$)/i, API_BASE_URL);
};

export default API_BASE_URL;
