import React from "react";
import { Outlet, useNavigate, useLocation, Navigate } from "react-router-dom"; // Tambahkan Navigate
import Sidebar from "../../components/Sidebar";
import Text from "../../components/Text";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // === REDIRECT DEFAULT ===
  // Jika user hanya mengakses "/admin", otomatis arahkan ke "/admin/angka"
  if (location.pathname === "/admin" || location.pathname === "/admin/") {
    return <Navigate to="/admin/angka" replace />;
  }

  // Mendeteksi halaman aktif dari URL (misal: /admin/angka -> 'angka')
  const activeMenu = location.pathname.split("/")[2] || "";

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* SIDEBAR - Fixed di kiri */}
      <Sidebar
        activeMenu={activeMenu}
        // Saat diklik, arahkan ke /admin/nama_menu.
        // Nanti file Layout masing-masing (misal LayoutAngka) yang akan otomatis mengarahkannya lagi ke /table
        setActiveMenu={(id) => navigate(`/admin/${id}`)}
        onLogout={() => navigate("/")}
      />

      {/* KONTEN UTAMA - Geser ke kanan sesuai lebar sidebar (w-72 = 18rem / 288px) */}
      <div className="flex-1 ml-72 flex flex-col">
        {/* Header Dashboard */}
        <header className="h-24 bg-white border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-20">
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
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              A
            </div>
          </div>
        </header>

        {/* Area Render Sub-Page */}
        <main className="p-10">
          {/* Outlet di sini akan merender LayoutAngka, LayoutHuruf, dst */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;