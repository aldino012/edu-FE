import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSortAlphaDown,
  FaListOl,
  FaPalette,
  FaGamepad,
  FaSignOutAlt,
} from "react-icons/fa";
import Text from "./Text"; // Import komponen Text modular

const Sidebar = ({ activeMenu, setActiveMenu, onLogout }) => {
  const navigate = useNavigate();

  // ======================
  // FUNGSI HANDLE LOGOUT
  // ======================
  const handleLogout = () => {
    // 1. Hapus kredensial/token admin dari localStorage
    localStorage.removeItem("admin_auth");

    // 2. Jika ada fungsi tambahan onLogout dari parent, eksekusi
    if (onLogout) {
      onLogout();
    }
    
    // 3. Arahkan kembali ke halaman utama publik (beranda), bukan ke halaman login
    navigate("/"); 
  };

  // Struktur data menu admin disesuaikan dengan key di Text.jsx
  const adminMenus = [
    {
      id: "huruf",
      textKey: "admin_menu_huruf",
      icon: <FaSortAlphaDown className="text-2xl" />,
    },
    {
      id: "angka",
      textKey: "admin_menu_angka",
      icon: <FaListOl className="text-2xl" />,
    },
    {
      id: "warna",
      textKey: "admin_menu_warna",
      icon: <FaPalette className="text-2xl" />,
    },
    {
      id: "quiz",
      textKey: "admin_menu_quiz",
      icon: <FaGamepad className="text-2xl" />,
    },
  ];

  return (
    <aside className="w-72 h-screen bg-slate-900 text-slate-300 flex flex-col shadow-2xl fixed left-0 top-0 border-r border-slate-800">
      {/* 1. Area Header / Logo Admin */}
      <div className="h-24 flex items-center justify-center border-b border-slate-800 bg-slate-950 px-6">
        <Text
          textKey="admin_sidebar_title"
          variant="subtitle"
          className="text-white text-center"
        />
      </div>

      {/* 2. Area Navigasi Menu */}
      <nav className="flex-1 py-8 flex flex-col gap-3 px-5 overflow-y-auto">
        {adminMenus.map((menu) => (
          <button
            key={menu.id}
            onClick={() => setActiveMenu && setActiveMenu(menu.id)}
            className={`
              flex items-center gap-5 px-5 py-4 rounded-2xl transition-all duration-200 w-full text-left outline-none
              ${
                activeMenu === menu.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 border border-blue-500 translate-x-2"
                  : "hover:bg-slate-800 hover:text-white border border-transparent hover:translate-x-1"
              }
            `}
          >
            {/* Ikon Menu */}
            <div
              className={`${activeMenu === menu.id ? "text-white" : "text-blue-400"}`}
            >
              {menu.icon}
            </div>

            {/* WADAH TEKS: Menggunakan komponen Text */}
            <div className="flex-1">
              <Text
                textKey={menu.textKey}
                variant="body"
                className="font-bold text-sm tracking-wide"
              />
            </div>
          </button>
        ))}
      </nav>

      {/* 3. Area Footer / Tombol Logout */}
      <div className="p-5 border-t border-slate-800 bg-slate-950/50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-5 px-5 py-4 w-full rounded-2xl border border-transparent hover:border-rose-500 hover:bg-rose-500/10 hover:text-rose-400 transition-all duration-200 text-slate-400 group"
        >
          {/* Ikon Logout */}
          <FaSignOutAlt className="text-2xl group-hover:scale-110 transition-transform" />

          {/* WADAH TEKS: Menggunakan teks Keluar */}
          <div className="flex-1 text-left">
            <Text
              textKey="btn_keluar" 
              className="font-bold text-sm tracking-wide"
            />
          </div>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;