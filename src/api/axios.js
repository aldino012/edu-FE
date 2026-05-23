import axios from "axios";

const api = axios.create({
  // import.meta.env.DEV adalah bawaan Vite.
  // Jika kamu jalankan 'npm run dev' di laptop, dia pakai "/api" (proxy jalan).
  // Jika FE di-deploy/di-build, dia otomatis pakai URL Backend Vercel.
  baseURL: import.meta.env.DEV ? "/api" : "https://edu-be-bice.vercel.app",
  timeout: 20000,
});

export default api;
