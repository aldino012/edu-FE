// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const authData = JSON.parse(localStorage.getItem("admin_auth"));
  const now = new Date().getTime();

  // Jika data tidak ada atau waktu sekarang melewati waktu kadaluarsa
  if (!authData || now > authData.expiry) {
    localStorage.removeItem("admin_auth"); // Hapus data yang sudah basi
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
