import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Attach the JWT token (if present) to every request made through this instance.
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Several existing components call the plain "axios" package directly with a
// hardcoded http://localhost:8080/api URL instead of this instance. Patch the
// global axios object too so those calls also carry the auth token.
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.url && config.url.includes("localhost:8080")) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
