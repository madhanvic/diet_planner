import axios from "axios";

const BASEAPIURL = import.meta.env.VITE_BASE_API_URL;

const api = axios.create({
  baseURL: BASEAPIURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      throw {
        message: error.response.data.message || "An error occurred",
      };
    }
    throw { error: "An error occurred" };
  }
);

export default api;
