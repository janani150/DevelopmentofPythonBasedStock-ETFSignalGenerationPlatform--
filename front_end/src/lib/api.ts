import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

export const api = axios.create({
  baseURL: API_BASE,
});

export const getStocks = async () => {
  const res = await api.get("/stocks");
  return res.data;
};

export const getPrediction = async (ticker: string) => {
  const res = await api.get(`/predict/${ticker}`);
  return res.data;
};
