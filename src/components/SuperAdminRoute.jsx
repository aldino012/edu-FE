import { Navigate } from "react-router-dom";

/**
 * ✅ SuperAdminRoute - Proteksi route khusus super_admin
 * Jika user bukan super_admin, redirect ke dashboard admin biasa
 */
const SuperAdminRoute = ({ children }) => {
  const authData = localStorage.getItem("admin_auth");

  // Jika belum login, redirect ke login
  if (!authData) {
    return <Navigate to="/admin/login" replace />;
  }

  try {
    const parsed = JSON.parse(authData);

    // Cek apakah token masih valid
    if (!parsed.token || parsed.expiry < Date.now()) {
      localStorage.removeItem("admin_auth");
      return <Navigate to="/admin/login" replace />;
    }

    // ✅ Cek apakah user adalah super_admin
    if (parsed.user?.role !== "super_admin") {
      console.warn("⚠️ Akses ditolak: Fitur ini hanya untuk super admin");
      // Redirect ke dashboard admin biasa (halaman angka)
      return <Navigate to="/admin/angka" replace />;
    }

    // Jika super_admin, lanjutkan render children
    return children;
  } catch (err) {
    console.error("Error parsing auth data:", err);
    localStorage.removeItem("admin_auth");
    return <Navigate to="/admin/login" replace />;
  }
};

export default SuperAdminRoute;
