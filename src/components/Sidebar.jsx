import React from "react";
import {
  FaSortAlphaDown,
  FaListOl,
  FaPalette,
  FaGamepad,
  FaSignOutAlt,
  FaShieldAlt,
  FaUserCheck,
} from "react-icons/fa";

const Sidebar = ({ activeMenu, setActiveMenu, onLogout, userData }) => {
  const handleLogout = async () => {
    console.log("🚪 Sidebar logout triggered...");
    if (onLogout) {
      await onLogout();
    }
  };

  const adminMenus = [
    {
      id: "huruf",
      label: "Huruf",
      icon: <FaSortAlphaDown className="text-xl" />,
    },
    {
      id: "angka",
      label: "Angka",
      icon: <FaListOl className="text-xl" />,
    },
    {
      id: "warna",
      label: "Warna",
      icon: <FaPalette className="text-xl" />,
    },
    {
      id: "quiz",
      label: "Quiz",
      icon: <FaGamepad className="text-xl" />,
    },
  ];

  const isSuperAdmin = userData?.role === "super_admin";

  return (
    <aside className="w-72 h-screen bg-slate-900 text-slate-300 flex flex-col shadow-2xl fixed left-0 top-0 border-r border-slate-800">
      {/* Header */}
      <div className="h-20 flex items-center justify-center border-b border-slate-800 bg-slate-950 px-6">
        <h1 className="text-white text-xl font-black tracking-wide">
          Admin Panel
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 flex flex-col gap-2 px-4">
        {/* Super Admin Section */}
        {isSuperAdmin && (
          <>
            <div className="px-4 mb-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Super Admin
              </span>
            </div>

            <button
              onClick={() => setActiveMenu && setActiveMenu("approval")}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 w-full text-left outline-none ${
                activeMenu === "approval"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30"
                  : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              <FaUserCheck
                className={
                  activeMenu === "approval" ? "text-white" : "text-amber-400"
                }
              />
              <span className="font-bold text-sm">Persetujuan Admin</span>
            </button>

            <div className="my-3 border-t border-slate-700"></div>
          </>
        )}

        {/* Konten Edukasi Section */}
        <div className="px-4 mb-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Konten Edukasi
          </span>
        </div>

        {adminMenus.map((menu) => (
          <button
            key={menu.id}
            onClick={() => setActiveMenu && setActiveMenu(menu.id)}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 w-full text-left outline-none ${
              activeMenu === menu.id
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "hover:bg-slate-800 hover:text-white"
            }`}
          >
            <div
              className={
                activeMenu === menu.id ? "text-white" : "text-blue-400"
              }
            >
              {menu.icon}
            </div>
            <span className="font-bold text-sm">{menu.label}</span>
          </button>
        ))}

        {/* Security Section - Hanya untuk super_admin */}
        {isSuperAdmin && (
          <>
            <div className="my-3 border-t border-slate-700"></div>

            <div className="px-4 mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Pengaturan
              </span>
            </div>

            <button
              onClick={() => setActiveMenu && setActiveMenu("security")}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 w-full text-left outline-none ${
                activeMenu === "security"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30"
                  : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              <FaShieldAlt
                className={
                  activeMenu === "security" ? "text-white" : "text-purple-400"
                }
              />
              <span className="font-bold text-sm">Keamanan</span>
              <span className="ml-auto text-[10px] font-bold bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                2FA
              </span>
            </button>
          </>
        )}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3 w-full rounded-xl border border-transparent hover:border-rose-500 hover:bg-rose-500/10 hover:text-rose-400 transition-all duration-200 text-slate-400 group"
        >
          <FaSignOutAlt className="text-xl group-hover:scale-110 transition-transform" />
          <span className="font-bold text-sm">Keluar</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;