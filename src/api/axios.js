import axios from "axios";

// ✅ TAMBAHKAN INI: Export API_BASE_URL
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "http://localhost:3000/api"
    : "https://edu-be-bice.vercel.app/api");

const api = axios.create({
  baseURL: API_BASE_URL, // ✅ Gunakan variabel yang sama
  timeout: 20000,
});

export default api;
