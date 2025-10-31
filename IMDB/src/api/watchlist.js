import axios from "axios";
const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const getWatchlist = () => axios.get(`${BASE}/api/watchlist`).then(r => r.data);
export const addToWatchlist = (item) => axios.post(`${BASE}/api/watchlist`,item).then(r => r.data);
export const deleteFromWatchlist = (id) => axios.delete(`${BASE}/api/watchlist/${id}`).then(r => r.data);