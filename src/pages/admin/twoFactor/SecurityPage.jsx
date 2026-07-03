import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Text from "../../../components/Text";
import Button from "../../../components/Button";
import { API_BASE_URL } from "../../../config/api"; // ✅ TAMBAH IMPORT INI
import {
  FaShieldAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaQrcode,
  FaTrash,
  FaLock,
} from "react-icons/fa";

// ✅ HAPUS: const API_URL = "http://localhost:3000/api/auth";
// ✅ GUNAKAN: API_BASE_URL dari config

const SecuritySettingsPage = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [disabling, setDisabling] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [disableCode, setDisableCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const getToken = () => {
    const authData = JSON.parse(localStorage.getItem("admin_auth") || "{}");
    return authData.token;
  };

  // Cek status 2FA saat halaman dibuka
  useEffect(() => {
    checkTwoFactorStatus();
  }, []);

  const checkTwoFactorStatus = async () => {
    try {
      // ✅ GUNAKAN API_BASE_URL
      const response = await fetch(`${API_BASE_URL}/2fa/status`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setTwoFactorEnabled(data.data.two_factor_enabled);
      }
    } catch (err) {
      console.error("Error checking 2FA status:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle disable 2FA
  const handleDisable2FA = async (e) => {
    e.preventDefault();
    setDisabling(true);
    setError("");

    if (!disableCode || disableCode.length !== 6) {
      setError("Kode harus 6 digit");
      setDisabling(false);
      return;
    }

    try {
      // ✅ GUNAKAN API_BASE_URL
      const response = await fetch(`${API_BASE_URL}/2fa/disable`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ code: disableCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal menonaktifkan 2FA");
      }

      setSuccess("2FA berhasil dinonaktifkan");
      setTwoFactorEnabled(false);
      setShowDisableModal(false);
      setDisableCode("");

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setDisabling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-500">Memuat...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-300 via-indigo-200 to-purple-300 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/95 backdrop-blur-sm p-8 rounded-[2.5rem] shadow-xl border-4 border-white/80">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <FaShieldAlt className="text-white text-3xl" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800">
                Pengaturan Keamanan
              </h1>
              <p className="text-slate-500">Kelola keamanan akun admin Anda</p>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-100 text-green-600 text-sm font-bold p-4 rounded-2xl mb-4 flex items-center gap-2">
              <FaCheckCircle />
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && !showDisableModal && (
            <div className="bg-rose-100 text-rose-600 text-sm font-bold p-4 rounded-2xl mb-4 flex items-center gap-2">
              <FaTimesCircle />
              {error}
            </div>
          )}

          {/* 2FA Status Card */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-6 border-2 border-slate-200 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FaLock className="text-2xl text-slate-700" />
                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    Two-Factor Authentication (2FA)
                  </h2>
                  <p className="text-sm text-slate-500">
                    Google Authenticator untuk keamanan ekstra
                  </p>
                </div>
              </div>

              {twoFactorEnabled ? (
                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                  <FaCheckCircle /> Aktif
                </span>
              ) : (
                <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                  <FaTimesCircle /> Nonaktif
                </span>
              )}
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <p className="text-sm text-slate-600 mb-3">
                {twoFactorEnabled
                  ? "✅ 2FA aktif. Setiap kali login, Anda perlu memasukkan kode 6 digit dari Google Authenticator."
                  : "⚠️ 2FA belum aktif. Aktifkan untuk menambah lapisan keamanan pada akun Anda."}
              </p>

              {twoFactorEnabled ? (
                <Button
                  onClick={() => setShowDisableModal(true)}
                  className="bg-gradient-to-r from-red-500 to-rose-500 text-white px-6 py-3 rounded-2xl font-bold hover:shadow-lg"
                >
                  <span className="flex items-center gap-2">
                    <FaTrash />
                    Nonaktifkan 2FA
                  </span>
                </Button>
              ) : (
                <Button
                  onClick={() => navigate("/admin/2fa/setup")}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-2xl font-bold hover:shadow-lg"
                >
                  <span className="flex items-center gap-2">
                    <FaQrcode />
                    Aktifkan 2FA
                  </span>
                </Button>
              )}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
            <h3 className="font-bold text-blue-800 mb-2">ℹ️ Tentang 2FA</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 2FA hanya berlaku untuk Super Admin</li>
              <li>• Kode berubah setiap 30 detik</li>
              <li>• Simpan backup key saat setup</li>
              <li>• Hubungi developer jika kehilangan akses</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal Disable 2FA */}
      {showDisableModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <FaShieldAlt className="text-red-500 text-xl" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                Nonaktifkan 2FA
              </h2>
            </div>

            <p className="text-slate-600 mb-4">
              Untuk keamanan, masukkan kode 6 digit dari Google Authenticator
              untuk konfirmasi.
            </p>

            {error && (
              <div className="bg-rose-100 text-rose-600 text-sm font-bold p-3 rounded-xl mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleDisable2FA} className="space-y-4">
              <input
                type="text"
                value={disableCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setDisableCode(value);
                  setError("");
                }}
                placeholder="123456"
                maxLength={6}
                className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 text-center text-2xl font-mono tracking-widest focus:border-red-400 focus:ring-4 focus:ring-red-400/20"
                required
                disabled={disabling}
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDisableModal(false);
                    setDisableCode("");
                    setError("");
                  }}
                  className="flex-1 py-3 rounded-2xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                  disabled={disabling}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={disabling || disableCode.length !== 6}
                  className="flex-1 py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-red-500 to-rose-500 hover:shadow-lg disabled:opacity-50"
                >
                  {disabling ? "Memproses..." : "Konfirmasi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecuritySettingsPage;