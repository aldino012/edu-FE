import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Ganti ke react-router-dom
import { API_BASE_URL } from "../../api/axios"; // ✅ Gunakan API_BASE_URL agar konsisten
import Card from "../../components/Card";
import Button from "../../components/Button";
import Text from "../../components/Text";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // ✅ Ganti ke useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      // ✅ Gunakan fetch dan API_BASE_URL
      const response = await fetch(
        `${API_BASE_URL}/auth/request-password-reset`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        setEmail("");
      } else {
        setError(data.message || "Gagal mengirim link reset.");
      }
    } catch (err) {
      setError(err.message || "Terjadi kesalahan pada server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-300 via-indigo-200 to-purple-300 p-4">
      <Card className="w-full max-w-md p-8 shadow-lg bg-white/95 backdrop-blur-sm rounded-[2.5rem] border-4 border-white/80">
        <div className="text-center mb-6">
          <Text variant="h2" className="text-2xl font-black text-slate-800">
            Lupa Password?
          </Text>
          <Text className="text-slate-500 mt-2 text-sm">
            Masukkan email terdaftar Anda. Kami akan mengirimkan link untuk
            mereset password.
          </Text>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-extrabold text-slate-500 ml-2 uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-6 py-4 rounded-3xl border-2 border-slate-200 outline-none transition-all text-slate-700 font-medium bg-slate-50 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-400/20"
              placeholder="admin@example.com"
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
            {loading ? "Mengirim..." : "Kirim Link Reset"}
          </Button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/admin/login")} // ✅ Ganti router.push ke navigate
            className="text-sm text-sky-600 font-bold hover:text-sky-700 hover:underline"
          >
            Kembali ke Halaman Login
          </button>
        </div>
      </Card>
    </div>
  );
}
