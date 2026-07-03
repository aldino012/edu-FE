import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import Text from "../../components/Text";
import Button from "../../components/Button";
import {
  FaStar,
  FaFont,
  FaShapes,
  FaMusic,
  FaPencilAlt,
  FaSmile,
  FaRocket,
  FaUserPlus,
  FaGoogle,
  FaClock,
} from "react-icons/fa";

// Inisialisasi Supabase Client menggunakan environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "❌ VITE_SUPABASE_URL atau VITE_SUPABASE_ANON_KEY tidak ditemukan di .env",
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const AdminRegister = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [googleUser, setGoogleUser] = useState(null);
  const navigate = useNavigate();

  // ✅ Validasi format email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle callback setelah redirect dari Google OAuth
  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Session error:", error);
          return;
        }

        if (session) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role, is_approved, full_name")
            .eq("id", session.user.id)
            .single();

          if (
            profile &&
            profile.role === "pending_admin" &&
            !profile.is_approved
          ) {
            setGoogleUser({
              email: session.user.email,
              full_name: profile.full_name,
            });

            await supabase.auth.signOut();
            return;
          }

          await supabase.auth.signOut();
          navigate("/admin/login");
        }
      } catch (err) {
        console.error("OAuth callback error:", err);
      }
    };

    handleOAuthCallback();
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ Validasi input wajib
    if (!fullName || !email || !password || !confirmPassword) {
      setError("Semua field wajib diisi");
      return;
    }

    // ✅ Validasi format email
    if (!validateEmail(email)) {
      setError("Format email tidak valid. Gunakan format: user@domain.com");
      return;
    }

    // ✅ Validasi password minimal 6 karakter
    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    // ✅ Validasi konfirmasi password
    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok");
      return;
    }

    // ✅ Validasi nama lengkap minimal 3 karakter
    if (fullName.trim().length < 3) {
      setError("Nama lengkap minimal 3 karakter");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registrasi gagal");
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/admin/login");
      }, 3000);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat registrasi");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setError("");
    setGoogleLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/admin/register",
        },
      });

      if (error) {
        throw error;
      }
    } catch (err) {
      setError(err.message || "Gagal memulai pendaftaran dengan Google");
      setGoogleLoading(false);
    }
  };

  const backgroundIcons = [
    {
      id: 1,
      Icon: FaStar,
      top: "10%",
      left: "10%",
      color: "text-yellow-300/60",
      size: "text-6xl",
      rotate: "rotate-12",
    },
    {
      id: 2,
      Icon: FaFont,
      top: "25%",
      left: "85%",
      color: "text-pink-300/60",
      size: "text-7xl",
      rotate: "-rotate-12",
    },
    {
      id: 3,
      Icon: FaShapes,
      top: "70%",
      left: "15%",
      color: "text-green-300/60",
      size: "text-6xl",
      rotate: "rotate-45",
    },
    {
      id: 4,
      Icon: FaMusic,
      top: "80%",
      left: "80%",
      color: "text-purple-300/60",
      size: "text-6xl",
      rotate: "-rotate-12",
    },
    {
      id: 5,
      Icon: FaPencilAlt,
      top: "50%",
      left: "8%",
      color: "text-orange-300/60",
      size: "text-5xl",
      rotate: "rotate-90",
    },
    {
      id: 6,
      Icon: FaSmile,
      top: "45%",
      left: "88%",
      color: "text-cyan-300/60",
      size: "text-5xl",
      rotate: "rotate-0",
    },
  ];

  // Tampilan untuk user Google yang baru daftar (pending approval)
  if (googleUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-300 via-indigo-200 to-purple-300 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {backgroundIcons.map(
            ({ id, Icon, top, left, color, size, rotate }) => (
              <div
                key={id}
                className={`absolute ${color} ${size} ${rotate} transform hover:scale-110 transition-transform duration-500`}
                style={{ top, left }}
              >
                <Icon />
              </div>
            ),
          )}
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-10 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] w-full max-w-md border-4 border-white/80 relative z-10 animate-fade-in-up text-center">
          <div className="w-24 h-24 bg-gradient-to-tr from-amber-400 to-orange-400 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-orange-400/40">
            <FaClock className="text-white text-5xl" />
          </div>

          <h2 className="text-3xl font-black text-slate-800 mb-4">
            Pendaftaran Berhasil! 🎉
          </h2>

          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <FaClock className="text-amber-600 text-2xl" />
              <span className="text-amber-800 font-bold text-lg">
                Menunggu Persetujuan
              </span>
            </div>

            <p className="text-amber-700 text-sm mb-2">
              Halo <strong>{googleUser.full_name}</strong>!
            </p>

            <p className="text-amber-700 text-sm">
              Akun Google Anda dengan email <strong>{googleUser.email}</strong>{" "}
              telah terdaftar.
            </p>

            <p className="text-amber-700 text-sm mt-3 font-medium">
              Akun Anda sedang menunggu persetujuan dari Super Admin. Anda akan
              mendapat notifikasi setelah akun disetujui.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-slate-600 text-sm">
              Silakan hubungi Super Admin untuk percepat proses persetujuan.
            </p>

            <button
              onClick={() => {
                setGoogleUser(null);
                navigate("/admin/login");
              }}
              className="w-full py-4 rounded-3xl font-black uppercase tracking-widest text-white text-base transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-500/40 active:translate-y-1 active:shadow-none bg-gradient-to-r from-sky-400 to-blue-500"
            >
              Kembali ke Login
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
              Sistem Edukasi Interaktif
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Tampilan sukses untuk register manual
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-300 via-indigo-200 to-purple-300 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {backgroundIcons.map(
            ({ id, Icon, top, left, color, size, rotate }) => (
              <div
                key={id}
                className={`absolute ${color} ${size} ${rotate} transform hover:scale-110 transition-transform duration-500`}
                style={{ top, left }}
              >
                <Icon />
              </div>
            ),
          )}
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-10 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] w-full max-w-md border-4 border-white/80 relative z-10 animate-fade-in-up text-center">
          <div className="w-20 h-20 bg-gradient-to-tr from-green-400 to-emerald-400 rounded-3xl mx-auto mb-5 flex items-center justify-center shadow-lg shadow-green-400/40">
            <FaRocket className="text-white text-4xl" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-3">
            Registrasi Berhasil! 🎉
          </h2>
          <p className="text-slate-600 mb-6">
            Akun Anda sedang menunggu konfirmasi dari super admin. Anda akan
            diarahkan ke halaman login...
          </p>
          <div className="animate-pulse text-sky-500 font-bold">
            Mohon tunggu...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-300 via-indigo-200 to-purple-300 flex items-center justify-center p-6 relative overflow-hidden">
      {/* OVERLAY ICON PATTERN */}
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

      {/* REGISTER CARD */}
      <div className="bg-white/95 backdrop-blur-sm p-10 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] w-full max-w-md border-4 border-white/80 relative z-10 animate-fade-in-up">
        {/* Header Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-tr from-amber-400 to-orange-400 rounded-3xl mx-auto mb-5 flex items-center justify-center shadow-lg shadow-orange-400/40 transform rotate-3 hover:rotate-6 transition-transform">
            <FaUserPlus className="text-white text-4xl" />
          </div>

          <Text
            textKey="admin_register_title"
            defaultText="Daftar Admin Baru"
            variant="subtitle"
            className="text-slate-800 font-black text-2xl"
          />
          <Text
            textKey="admin_register_subtitle"
            defaultText="Bergabunglah sebagai admin edukasi"
            variant="body"
            className="text-slate-500 text-sm mt-2 font-medium"
          />
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Full Name Input */}
          <div className="space-y-2">
            <label className="block text-sm font-extrabold text-slate-500 ml-2 uppercase tracking-wider">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (error) setError("");
              }}
              placeholder="John Doe"
              className="w-full px-6 py-4 rounded-3xl border-2 border-slate-200 outline-none transition-all text-slate-700 font-medium bg-slate-50 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-400/20"
              required
              disabled={loading || googleLoading}
            />
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <label className="block text-sm font-extrabold text-slate-500 ml-2 uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              placeholder="admin@example.com"
              className="w-full px-6 py-4 rounded-3xl border-2 border-slate-200 outline-none transition-all text-slate-700 font-medium bg-slate-50 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-400/20"
              required
              disabled={loading || googleLoading}
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="block text-sm font-extrabold text-slate-500 ml-2 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              placeholder="Minimal 6 karakter"
              className="w-full px-6 py-4 rounded-3xl border-2 border-slate-200 outline-none transition-all text-slate-700 font-medium bg-slate-50 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-400/20"
              required
              disabled={loading || googleLoading}
              minLength={6}
            />
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-2">
            <label className="block text-sm font-extrabold text-slate-500 ml-2 uppercase tracking-wider">
              Konfirmasi Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (error) setError("");
              }}
              placeholder="Minimal 6 karakter"
              className="w-full px-6 py-4 rounded-3xl border-2 border-slate-200 outline-none transition-all text-slate-700 font-medium bg-slate-50 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-400/20"
              required
              disabled={loading || googleLoading}
              minLength={6}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-rose-100 text-rose-600 text-xs font-bold text-center p-3 rounded-2xl animate-bounce">
              {error} 🚀
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full py-4 rounded-3xl font-black uppercase tracking-widest text-white text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-500/40 active:translate-y-1 active:shadow-none bg-gradient-to-r from-sky-400 to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span className="flex items-center justify-center gap-2">
              {loading ? "Mendaftar..." : "Daftar Sekarang"}
            </span>
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t-2 border-slate-200"></div>
          <span className="px-4 text-slate-400 text-xs font-bold uppercase tracking-wider">
            atau
          </span>
          <div className="flex-1 border-t-2 border-slate-200"></div>
        </div>

        {/* Google Register Button */}
        <button
          type="button"
          onClick={handleGoogleRegister}
          disabled={loading || googleLoading}
          className="w-full py-4 rounded-3xl font-bold uppercase tracking-wider text-slate-700 text-base transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl active:translate-y-1 active:shadow-none bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
        >
          {googleLoading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-slate-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Menghubungkan...
            </span>
          ) : (
            <>
              <FaGoogle className="text-xl" style={{ color: "#4285F4" }} />
              <span>Daftar dengan Google</span>
            </>
          )}
        </button>

        <div className="text-center mt-6">
          <p className="text-slate-500 text-sm">
            Sudah punya akun?{" "}
            <Link
              to="/admin/login"
              className="text-sky-600 font-bold hover:text-sky-700 underline"
            >
              Login di sini
            </Link>
          </p>
        </div>

        <div className="text-center mt-6">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
            Sistem Edukasi Interaktif
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;