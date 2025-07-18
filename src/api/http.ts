import axios from "axios";

export const http = axios.create({
  baseURL: "http://localhost:3001/api", // ou use env
  headers: {
    "Content-Type": "application/json",
  },
});
