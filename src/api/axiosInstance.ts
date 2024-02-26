import axios, { AxiosInstance } from "axios";

function createAxiosInstance(token?: string): AxiosInstance {
  const instance = axios.create({
    // baseURL: "http://localhost:5100",
    baseURL: "https://ezra-seminary-api.onrender.com",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return instance;
}

export default createAxiosInstance;
