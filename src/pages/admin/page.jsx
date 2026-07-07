import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation, Navigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import Sidebar from "../../components/Sidebar";
import Text from "../../components/Text";
import { FaShieldAlt } from "react-icons/fa";

// Inisialisasi Supabase Client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase config missing");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ DAFTAR ROUTE PUBLIK (TIDAK PERLU LOGIN & TIDAK PAKAI SIDEBAR)
  const publicRoutes = [
    "/admin/login",
    "/admin/register",
    "/admin/forgot-password",
    "/admin/reset-password",
  ];

  // Cek apakah path saat ini termasuk route publik
  const isPublicRoute = publicRoutes.some((route) =>
    location.pathname.startsWith(route),
  );

  useEffect(() => {
    const checkAuth = () => {
      console.log("🔍 AdminLayout auth check:", {
        pathname: location.pathname,
        isPublicRoute,
      });

      // ✅ JIKA ROUTE PUBLIK, SKIP CEK AUTHENTIKASI
      if (isPublicRoute) {
        setIsLoading(false);
        return;
      }

      const authData = localStorage.getItem("admin_auth");

      if (!authData) {
        console.warn("⚠️ No auth in AdminLayout, redirecting to login");
        navigate("/admin/login", { replace: true });
        return;
      }

      try {
        const parsed = JSON.parse(authData);

        // Cek token expired
        if (!parsed.token || parsed.expiry < Date.now()) {
          console.warn("⚠️ Token expired in AdminLayout");
          localStorage.removeItem("admin_auth");
          navigate("/admin/login", { replace: true });
          return;
        }

        // Token valid
        setUserData(parsed.user);
        setIsLoading(false);
      } catch (err) {
        console.error("❌ Error parsing auth:", err);
        localStorage.removeItem("admin_auth");
        navigate("/admin/login", { replace: true });
      }
    };

    checkAuth();
  }, [navigate, location.pathname, isPublicRoute]);

  // ✅ JIKA ROUTE PUBLIK, RENDER LANGSUNG <Outlet /> TANPA SIDEBAR & HEADER
  if (isPublicRoute) {
    return <Outlet />;
  }

  // Tampilkan loading sambil cek auth (hanya untuk route privat)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Jika tidak ada userData, return null (akan di-redirect oleh useEffect)
  if (!userData) {
    return null;
  }

  // ... rest of your AdminLayout code (Sidebar, Header, dll)
  const activeMenu = location.pathname.split("/")[2] || "";

  const handleLogout = async () => {
    console.log("🚪 Logging out...");
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Error signing out:", err);
    }
    localStorage.removeItem("admin_auth");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();
    navigate("/");
  };

  const getInitial = (name) => {
    if (!name) return "A";
    return name.charAt(0).toUpperCase();
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "super_admin":
        return "bg-gradient-to-r from-purple-500 to-pink-500";
      case "admin":
        return "bg-gradient-to-r from-blue-500 to-cyan-500";
      default:
        return "bg-blue-100 text-blue-600";
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "super_admin":
        return "Super Admin";
      case "admin":
        return "Admin";
      default:
        return "User";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={(id) => navigate(`/admin/${id}`)}
        onLogout={handleLogout}
        userData={userData}
      />

      <div className="flex-1 ml-72 flex flex-col">
        <header className="h-24 bg-white border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-20 shadow-sm">
          <div>
            <Text
              textKey="admin_sidebar_title"
              variant="subtitle"
              className="text-slate-800"
            />
            <p className="text-xs text-slate-400 font-medium">
              Manajemen Konten Edukasi
            </p>
          </div>

          <div className="flex items-center gap-4">
            {userData && (
              <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200">
                <div
                  className={`w-10 h-10 rounded-full ${getRoleColor(userData.role)} flex items-center justify-center text-white font-bold shadow-lg`}
                >
                  {getInitial(userData.full_name || userData.email)}
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-700">
                    {userData.full_name || userData.email}
                  </p>
                  <div className="flex items-center gap-1 justify-end">
                    {userData.role === "super_admin" && (
                      <FaShieldAlt className="text-purple-500 text-xs" />
                    )}
                    <span className="text-xs text-slate-500 font-medium">
                      {getRoleLabel(userData.role)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
