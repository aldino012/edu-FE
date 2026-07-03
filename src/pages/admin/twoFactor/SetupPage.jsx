import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Text from "../../../components/Text";
import Button from "../../../components/Button";
import {
  FaQrcode,
  FaKey,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowLeft,
  FaShieldAlt,
} from "react-icons/fa";

const API_URL = "http://localhost:3000/api/auth";

const TwoFactorSetupPage = () => {
  const [step, setStep] = useState(1); // 1: Generate QR, 2: Verify Code
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Get token dari localStorage
  const getToken = () => {
    const authData = JSON.parse(localStorage.getItem("admin_auth") || "{}");
    return authData.token;
  };

  // Step 1: Generate QR Code
  const handleGenerateQR = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/2fa/setup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal generate QR code");
      }

      setQrCode(data.data.qrCode);
      setSecret(data.data.secret);
      setStep(2);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify Code
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!code || code.length !== 6) {
      setError("Kode harus 6 digit");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/2fa/verify-setup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Kode tidak valid");
      }

      setSuccess("2FA berhasil diaktifkan!");
      setTimeout(() => {
        navigate("/admin/security");
      }, 2000);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-300 via-indigo-200 to-purple-300 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/admin/security")}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4"
          >
            <FaArrowLeft />
            <span>Kembali ke Keamanan</span>
          </button>

          <div className="bg-white/95 backdrop-blur-sm p-8 rounded-[2.5rem] shadow-xl border-4 border-white/80">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <FaShieldAlt className="text-white text-3xl" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-800">
                  Setup Google Authenticator
                </h1>
                <p className="text-slate-500 text-sm">Langkah {step} dari 2</p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-rose-100 text-rose-600 text-sm font-bold p-4 rounded-2xl mb-4 flex items-center gap-2">
                <FaExclamationTriangle />
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-100 text-green-600 text-sm font-bold p-4 rounded-2xl mb-4 flex items-center gap-2">
                <FaCheckCircle />
                {success}
              </div>
            )}

            {/* STEP 1: Generate QR */}
            {step === 1 && (
              <div className="text-center space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-700 mb-2">
                    Aktifkan Two-Factor Authentication
                  </h2>
                  <p className="text-slate-500 text-sm">
                    Klik tombol di bawah untuk generate QR code. Anda akan
                    memerlukan aplikasi Google Authenticator di smartphone.
                  </p>
                </div>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 text-left">
                  <h3 className="font-bold text-blue-800 mb-2">
                    📱 Belum punya Google Authenticator?
                  </h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Android: Download di Google Play Store</li>
                    <li>• iOS: Download di App Store</li>
                    <li>• Alternatif: Authy, Microsoft Authenticator</li>
                  </ul>
                </div>

                <Button
                  onClick={handleGenerateQR}
                  disabled={loading}
                  className="w-full py-4 rounded-3xl font-black uppercase tracking-widest text-white text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-xl hover:shadow-purple-500/40 disabled:opacity-50"
                >
                  {loading ? "Generating..." : "Generate QR Code"}
                </Button>
              </div>
            )}

            {/* STEP 2: Scan QR + Verify */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl font-bold text-slate-700 mb-2">
                    Scan QR Code dengan Google Authenticator
                  </h2>
                  <p className="text-slate-500 text-sm mb-4">
                    Buka aplikasi Google Authenticator, tap "+", lalu pilih
                    "Scan a QR code"
                  </p>
                </div>

                {/* QR Code Display */}
                <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 flex justify-center">
                  {qrCode ? (
                    <img src={qrCode} alt="QR Code 2FA" className="w-64 h-64" />
                  ) : (
                    <div className="w-64 h-64 bg-slate-100 rounded-lg flex items-center justify-center">
                      <FaQrcode className="text-slate-400 text-6xl" />
                    </div>
                  )}
                </div>

                {/* Manual Entry Key */}
                <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FaKey className="text-amber-600" />
                    <span className="font-bold text-amber-800 text-sm">
                      Atau masukkan manual:
                    </span>
                  </div>
                  <div className="bg-white px-4 py-2 rounded-lg border border-amber-300 font-mono text-sm text-amber-900 break-all">
                    {secret}
                  </div>
                  <p className="text-xs text-amber-700 mt-2">
                    💡 Simpan kunci ini di tempat aman sebagai backup
                  </p>
                </div>

                {/* Verify Code Form */}
                <form onSubmit={handleVerifyCode} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-2">
                      Masukkan 6 digit kode dari Google Authenticator:
                    </label>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => {
                        // Hanya izinkan angka dan max 6 digit
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 6);
                        setCode(value);
                      }}
                      placeholder="123456"
                      maxLength={6}
                      className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 text-center text-2xl font-mono tracking-widest focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20"
                      required
                      disabled={loading}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading || code.length !== 6}
                    className="w-full py-4 rounded-3xl font-black uppercase tracking-widest text-white text-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-xl disabled:opacity-50"
                  >
                    {loading ? "Memverifikasi..." : "Verifikasi & Aktifkan"}
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorSetupPage;
