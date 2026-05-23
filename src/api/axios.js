import axios from "axios";

const api = axios.create({
  // Jika berjalan di lokal (npm run dev), gunakan proxy "/api"
  // Jika berjalan di Vercel (production), gunakan URL Backend lengkap dengan akhiran "/api"
  baseURL: import.meta.env.DEV ? "/api" : "https://edu-be-bice.vercel.app/api",
  timeout: 20000,
});

export default api;
