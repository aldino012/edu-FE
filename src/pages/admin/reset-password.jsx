import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Ganti ke react-router-dom
import { API_BASE_URL } from "../../api/axios"; // ✅ Gunakan API_BASE_URL
import Card from "../../components/Card";
import Button from "../../components/Button";
import Text from "../../components/Text";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [accessToken, setAccessToken] = useState(null);
  const navigate = useNavigate(); // ✅ Ganti ke useNavigate

  // 1. Ekstrak Token dari URL Hash saat komponen di-mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.substring(1); // Hapus tanda '#'
      const params = new URLSearchParams(hash);
      const token = params.get("access_token");

      if (token) {
        setAccessToken(token);
      } else {
        setError(
          "Link reset password tidak valid atau sudah kedaluwarsa. Silakan minta link baru.",
        );
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      // 2. Kirim request ke backend dengan menyertakan Token di Header
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // ✅ Kirim token untuk autentikasi
        },
        body: JSON.stringify({ new_password: newPassword }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(
          "Password berhasil direset! Anda akan dialihkan ke halaman login...",
        );
        setTimeout(() => {
          // Hapus hash dari URL agar token tidak tersisa di browser
          window.history.replaceState(null, "", window.location.pathname);
          navigate("/admin/login"); // ✅ Ganti router.push ke navigate
        }, 2000);
      } else {
        setError(data.message || "Gagal mereset password.");
      }
    } catch (err) {
      if (err.message.includes("401") || err.message.includes("Unauthorized")) {
        setError(
          "Sesi reset password sudah kedaluwarsa. Silakan minta link baru.",
        );
      } else {
        setError(err.message || "Terjadi kesalahan pada server.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Jika token tidak ditemukan, tampilkan error dan opsi minta link baru
  if (!accessToken && error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-300 via-indigo-200 to-purple-300 p-4">
        <Card className="w-full max-w-md p-8 shadow-lg bg-white/95 backdrop-blur-sm rounded-[2.5rem] border-4 border-white/80 text-center">
          <Text variant="h2" className="text-xl font-black text-rose-600 mb-4">
            Link Tidak Valid
          </Text>
          <Text className="text-slate-600 mb-6">{error}</Text>
          <Button
            onClick={() => navigate("/admin/forgot-password")} // ✅ Ganti router.push ke navigate
            className="px-6 py-4 rounded-3xl font-black uppercase tracking-widest text-white text-base bg-gradient-to-r from-sky-400 to-blue-500"
          >
            Minta Link Baru
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-300 via-indigo-200 to-purple-300 p-4">
      <Card className="w-full max-w-md p-8 shadow-lg bg-white/95 backdrop-blur-sm rounded-[2.5rem] border-4 border-white/80">
        <div className="text-center mb-6">
          <Text variant="h2" className="text-2xl font-black text-slate-800">
            Buat Password Baru
          </Text>
          <Text className="text-slate-500 mt-2 text-sm">
            Silakan masukkan password baru Anda di bawah ini.
          </Text>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-extrabold text-slate-500 ml-2 uppercase tracking-wider">
              Password Baru
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-6 py-4 rounded-3xl border-2 border-slate-200 outline-none transition-all text-slate-700 font-medium bg-slate-50 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-400/20"
              placeholder="Minimal 6 karakter"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-extrabold text-slate-500 ml-2 uppercase tracking-wider">
              Konfirmasi Password Baru
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-6 py-4 rounded-3xl border-2 border-slate-200 outline-none transition-all text-slate-700 font-medium bg-slate-50 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-400/20"
              placeholder="Ulangi password baru"
            />
          </div>

          {message && (
            <div className="p-3 bg-green-50 text-green-700 text-sm rounded-2xl border border-green-200 text-center font-bold">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-rose-100 text-rose-600 text-xs font-bold text-center p-3 rounded-2xl animate-bounce">
              {error} 🚀
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-3xl font-black uppercase tracking-widest text-white text-lg bg-gradient-to-r from-sky-400 to-blue-500 disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan Password Baru"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
