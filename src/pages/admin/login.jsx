import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Text from "../../components/Text";
import Button from "../../components/Button";
// Import beberapa ikon ceria untuk background dan logo
import {
  FaStar,
  FaFont,
  FaShapes,
  FaMusic,
  FaPencilAlt,
  FaSmile,
  FaRocket,
} from "react-icons/fa";

const AdminLogin = () => {
  const [token, setToken] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const VALID_TOKEN = "AKU_ADALAH_TOKEN_EDU";

  const handleLogin = (e) => {
    e.preventDefault();

    if (token !== VALID_TOKEN) {
      setError(true);
      setToken("");
      return;
    }

    const now = new Date().getTime();
    const authData = {
      token: token,
      expiry: now + 3600000, 
    };

    localStorage.setItem("admin_auth", JSON.stringify(authData));
    setError(false);
    navigate("/admin/huruf");
  };

  // Kumpulan Icon untuk pola acak di background
  const backgroundIcons = [
    { id: 1, Icon: FaStar, top: "10%", left: "10%", color: "text-yellow-300/60", size: "text-6xl", rotate: "rotate-12" },
    { id: 2, Icon: FaFont, top: "25%", left: "85%", color: "text-pink-300/60", size: "text-7xl", rotate: "-rotate-12" },
    { id: 3, Icon: FaShapes, top: "70%", left: "15%", color: "text-green-300/60", size: "text-6xl", rotate: "rotate-45" },
    { id: 4, Icon: FaMusic, top: "80%", left: "80%", color: "text-purple-300/60", size: "text-6xl", rotate: "-rotate-12" },
    { id: 5, Icon: FaPencilAlt, top: "50%", left: "8%", color: "text-orange-300/60", size: "text-5xl", rotate: "rotate-90" },
    { id: 6, Icon: FaSmile, top: "45%", left: "88%", color: "text-cyan-300/60", size: "text-5xl", rotate: "rotate-0" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-300 via-indigo-200 to-purple-300 flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* OVERLAY ICON PATTERN (Pola Acak Edukasi) */}
      <div className="absolute inset-0 pointer-events-none">
        {backgroundIcons.map(({ id, Icon, top, left, color, size, rotate }) => (
          <div
            key={id}
            className={`absolute ${color} ${size} ${rotate} transform hover:scale-110 transition-transform duration-500`}
            style={{ top, left }}
          >
            <Icon />
          </div>
        ))}
      </div>

      {/* LOGIN CARD */}
      <div className="bg-white/95 backdrop-blur-sm p-10 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] w-full max-w-md border-4 border-white/80 relative z-10 animate-fade-in-up">
        
        {/* Header Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-tr from-amber-400 to-orange-400 rounded-3xl mx-auto mb-5 flex items-center justify-center shadow-lg shadow-orange-400/40 transform rotate-3 hover:rotate-6 transition-transform">
            <FaRocket className="text-white text-4xl" />
          </div>
          
          <Text
            textKey="admin_sidebar_title"
            variant="subtitle"
            className="text-slate-800 font-black text-2xl"
          />
          <Text
            textKey="admin_login_subtitle"
            variant="body"
            className="text-slate-500 text-sm mt-2 font-medium"
          />
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-3">
            <label className="block text-sm font-extrabold text-slate-500 ml-2 uppercase tracking-wider">
              Token Akses
            </label>

            <input
              type="password"
              value={token}
              onChange={(e) => {
                setToken(e.target.value);
                if (error) setError(false);
              }}
              placeholder="••••••••"
              className={`w-full px-6 py-4 rounded-3xl border-2 outline-none transition-all text-center tracking-[0.5em] text-xl font-bold bg-slate-50 ${
                error
                  ? "border-rose-400 bg-rose-50 text-rose-600 focus:ring-4 focus:ring-rose-500/20"
                  : "border-slate-200 text-slate-700 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-400/20"
              }`}
              required
            />

            {/* Pesan Error */}
            {error && (
              <div className="bg-rose-100 text-rose-600 text-xs font-bold text-center p-3 rounded-2xl animate-bounce">
                Ups! Token salah, coba lagi ya! 🚀
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full py-4 rounded-3xl font-black uppercase tracking-widest text-white text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-500/40 active:translate-y-1 active:shadow-none bg-gradient-to-r from-sky-400 to-blue-500"
          >
            <span className="flex items-center justify-center gap-2">
              <Text textKey="admin_login_btn" />
            </span>
          </Button>
        </form>

        <div className="text-center mt-8">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
            Sistem Edukasi Interaktif
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;