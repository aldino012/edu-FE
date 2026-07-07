import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import Text from "../../components/Text";
import Button from "../../components/Button";
import { API_BASE_URL } from "../../api/axios";
import {
  FaStar,
  FaFont,
  FaShapes,
  FaMusic,
  FaPencilAlt,
  FaSmile,
  FaRocket,
  FaGoogle,
  FaClock,
  FaCheckCircle,
  FaShieldAlt,
} from "react-icons/fa";

// Inisialisasi Supabase Client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "❌ VITE_SUPABASE_URL atau VITE_SUPABASE_ANON_KEY tidak ditemukan di .env",
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);

  // State untuk 2FA
  const [need2FA, setNeed2FA] = useState(false);
  const [tempId, setTempId] = useState("");
  const [twoFACode, setTwoFACode] = useState("");
  const [userData, setUserData] = useState(null);

  const navigate = useNavigate();

  // ✅ Reset semua state saat component mount
  useEffect(() => {
    setNeed2FA(false);
    setTempId("");
    setTwoFACode("");
    setUserData(null);
    setError("");

    const authData = localStorage.getItem("admin_auth");
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        if (parsed.token && parsed.expiry > Date.now()) {
          navigate("/admin/huruf");
        } else {
          localStorage.removeItem("admin_auth");
        }
      } catch (err) {
        localStorage.removeItem("admin_auth");
      }
    }
  }, [navigate]);

  // Handle callback dari Google OAuth
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
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("role, is_approved, full_name")
            .eq("id", session.user.id)
            .single();

          if (profileError && profileError.code === "PGRST116") {
            console.log(
              "⚠️ Profile tidak ada, membuat profile baru untuk user Google...",
            );

            const fullName =
              session.user.user_metadata?.full_name ||
              session.user.email.split("@")[0];

            const { error: insertError } = await supabase
              .from("profiles")
              .insert({
                id: session.user.id,
                full_name: fullName,
                role: "pending_admin",
                is_approved: false,
              });

            if (insertError) {
              console.error("Error creating profile:", insertError);
              setError("Gagal membuat profil user");
              await supabase.auth.signOut();
              return;
            }

            setPendingUser({
              email: session.user.email,
              full_name: fullName,
            });
            await supabase.auth.signOut();
            return;
          }

          if (profileError) {
            console.error("Profile error:", profileError);
            setError("Gagal memuat data profil");
            return;
          }

          if (profile.role === "pending_admin" && !profile.is_approved) {
            setPendingUser({
              email: session.user.email,
              full_name: profile.full_name,
            });
            await supabase.auth.signOut();
            return;
          }

          const now = new Date().getTime();
          const authData = {
            token: session.access_token,
            user: {
              id: session.user.id,
              email: session.user.email,
              full_name: profile.full_name,
              role: profile.role,
            },
            expiry: now + 3600000,
          };

          localStorage.setItem("admin_auth", JSON.stringify(authData));
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
          );
          navigate("/admin/huruf");
        }
      } catch (err) {
        console.error("OAuth callback error:", err);
        setError("Terjadi kesalahan saat memproses login");
      }
    };

    handleOAuthCallback();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login gagal");
      }

      if (data.need_2fa) {
        console.log("🔐 2FA required, showing verification form");
        setNeed2FA(true);
        setTempId(data.temp_id);
        setUserData(data.user);
        setLoading(false);
        return;
      }

      console.log("✅ Login successful without 2FA");
      const now = new Date().getTime();
      const authData = {
        token: data.token,
        user: data.user,
        expiry: now + 3600000,
      };

      localStorage.setItem("admin_auth", JSON.stringify(authData));
      navigate("/admin/huruf");
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat login");
      setEmail("");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!twoFACode || twoFACode.length !== 6) {
      setError("Kode harus 6 digit");
      setLoading(false);
      return;
    }

    try {
      console.log("🔐 Verifying 2FA code...");
      const response = await fetch(`${API_BASE_URL}/auth/2fa/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          temp_id: tempId,
          code: twoFACode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Kode 2FA tidak valid");
      }

      console.log("✅ 2FA verification successful");

      const now = new Date().getTime();
      const authData = {
        token: data.token,
        user: data.user,
        expiry: now + 3600000,
      };

      localStorage.setItem("admin_auth", JSON.stringify(authData));

      setNeed2FA(false);
      setTempId("");
      setTwoFACode("");
      setUserData(null);

      navigate("/admin/huruf");
    } catch (err) {
      setError(err.message || "Verifikasi 2FA gagal");
      setTwoFACode("");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setPendingUser(null);
    setGoogleLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/admin/login",
        },
      });

      if (error) {
        throw error;
      }
    } catch (err) {
      setError(err.message || "Gagal memulai login dengan Google");
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

  // Tampilan untuk user pending
  if (pendingUser) {
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
              Halo <strong>{pendingUser.full_name}</strong>!
            </p>
            <p className="text-amber-700 text-sm">
              Akun Anda dengan email <strong>{pendingUser.email}</strong> telah
              terdaftar.
            </p>
            <p className="text-amber-700 text-sm mt-3 font-medium">
              Akun Anda sedang menunggu persetujuan dari Super Admin.
            </p>
          </div>

          <button
            onClick={() => {
              setPendingUser(null);
              navigate("/admin/login");
            }}
            className="w-full py-4 rounded-3xl font-black uppercase tracking-widest text-white text-base bg-gradient-to-r from-sky-400 to-blue-500"
          >
            Kembali ke Login
          </button>
        </div>
      </div>
    );
  }

  // Tampilan 2FA Verification
  if (need2FA) {
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

        <div className="bg-white/95 backdrop-blur-sm p-10 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] w-full max-w-md border-4 border-white/80 relative z-10 animate-fade-in-up">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-purple-500/40">
              <FaShieldAlt className="text-white text-4xl" />
            </div>
            <h2 className="text-2xl font-black text-slate-800">
              Verifikasi 2FA
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              Masukkan kode 6 digit dari Google Authenticator
            </p>
            <p className="text-slate-400 text-xs mt-1">
              Login sebagai: {userData?.email}
            </p>
          </div>

          {error && (
            <div className="bg-rose-100 text-rose-600 text-xs font-bold text-center p-3 rounded-2xl mb-4 animate-bounce">
              {error} 🚀
            </div>
          )}

          <form onSubmit={handleVerify2FA} className="space-y-4">
            <input
              type="text"
              value={twoFACode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                setTwoFACode(value);
                if (error) setError("");
              }}
              placeholder="123456"
              maxLength={6}
              className="w-full px-6 py-4 rounded-3xl border-2 border-slate-200 text-center text-2xl font-mono tracking-widest focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-400/20 outline-none transition-all"
              required
              disabled={loading}
              autoFocus
            />

            <Button
              type="submit"
              disabled={loading || twoFACode.length !== 6}
              className="w-full py-4 rounded-3xl font-black uppercase tracking-widest text-white text-lg bg-gradient-to-r from-purple-500 to-pink-500 disabled:opacity-50"
            >
              {loading ? "Memverifikasi..." : "Verifikasi"}
            </Button>

            <button
              type="button"
              onClick={() => {
                setNeed2FA(false);
                setTempId("");
                setTwoFACode("");
                setUserData(null);
                setError("");
              }}
              className="w-full text-slate-500 text-sm hover:text-slate-700 font-medium"
              disabled={loading}
            >
              Batal
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Tampilan login normal
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-300 via-indigo-200 to-purple-300 flex items-center justify-center p-6 relative overflow-hidden">
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

      <div className="bg-white/95 backdrop-blur-sm p-10 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] w-full max-w-md border-4 border-white/80 relative z-10 animate-fade-in-up">
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

          {/* ❌ FITUR LUPA PASSWORD TELAH DIHAPUS */}
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
              placeholder="••••••••"
              className="w-full px-6 py-4 rounded-3xl border-2 border-slate-200 outline-none transition-all text-slate-700 font-medium bg-slate-50 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-400/20"
              required
              disabled={loading || googleLoading}
            />
          </div>

          {error && (
            <div className="bg-rose-100 text-rose-600 text-xs font-bold text-center p-3 rounded-2xl animate-bounce">
              {error} 🚀
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full py-4 rounded-3xl font-black uppercase tracking-widest text-white text-lg bg-gradient-to-r from-sky-400 to-blue-500 disabled:opacity-50"
          >
            {loading ? "Memproses..." : <Text textKey="admin_login_btn" />}
          </Button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 border-t-2 border-slate-200"></div>
          <span className="px-4 text-slate-400 text-xs font-bold uppercase tracking-wider">
            atau
          </span>
          <div className="flex-1 border-t-2 border-slate-200"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading || googleLoading}
          className="w-full py-4 rounded-3xl font-bold uppercase tracking-wider text-slate-700 text-base bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50 flex items-center justify-center gap-3"
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
              <span>Login dengan Google</span>
            </>
          )}
        </button>

        <div className="text-center mt-6">
          <p className="text-slate-500 text-sm">
            Belum punya akun?{" "}
            <Link
              to="/admin/register"
              className="text-sky-600 font-bold hover:text-sky-700 underline"
            >
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;