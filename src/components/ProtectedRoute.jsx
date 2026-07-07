// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const location = useLocation();

  // 1. Cek apakah ada data auth di localStorage
  const authDataRaw = localStorage.getItem("admin_auth");

  // Jika tidak ada data auth sama sekali, lempar ke LOGIN (bukan homepage!)
  if (!authDataRaw) {
    console.warn("⚠️ No auth data found, redirecting to login...");
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  try {
    // 2. Parse data auth dengan error handling
    const authData = JSON.parse(authDataRaw);

    // 3. Cek apakah token ada DAN belum expired
    const now = new Date().getTime();
    const isTokenValid = authData.token && authData.expiry > now;

    // Jika token invalid atau expired, hapus dari storage dan lempar ke LOGIN
    if (!isTokenValid) {
      console.warn("⚠️ Token invalid atau expired, redirecting to login...");
      localStorage.removeItem("admin_auth");
      return <Navigate to="/admin/login" replace state={{ from: location }} />;
    }

    // 4. Jika semua valid, izinkan akses ke halaman admin
    return <Outlet />;
  } catch (err) {
    // Jika data corrupt (bukan JSON valid), hapus dan lempar ke LOGIN
    console.error("❌ Error parsing auth data:", err);
    localStorage.removeItem("admin_auth");
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }
};

export default ProtectedRoute;
