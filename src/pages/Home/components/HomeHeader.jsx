import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaVolumeUp, FaVolumeMute, FaUserEdit } from "react-icons/fa";
import { createClient } from "@supabase/supabase-js";
import Text from "../../../components/Text";

// Inisialisasi Supabase Client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ✅ KONFIGURASI BUCKET & FILE AVATAR (Huruf Kapital sesuai file asli)
const BUCKET_NAME = "assets-fe";
const FOLDER_PATH = "images";
const AVATAR_FILES = [
  "Avatar1.png",
  "Avatar2.png",
  "Avatar3.png",
  "Avatar4.png",
  "Avatar5.png",
];

const HomeHeader = ({ audioRef, isPlaying, toggleAudio }) => {
  const navigate = useNavigate();
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [availableAvatars, setAvailableAvatars] = useState([]);

  // ✅ Load profil dari localStorage saat komponen mount
  useEffect(() => {
    const savedProfile = localStorage.getItem("selected_profile");
    if (savedProfile) {
      setSelectedProfile(JSON.parse(savedProfile));
    }
  }, []);

  // ✅ Generate public URL untuk setiap avatar
  useEffect(() => {
    const avatars = AVATAR_FILES.map((fileName, index) => {
      const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(`${FOLDER_PATH}/${fileName}`);

      return {
        id: index + 1,
        name: `Avatar ${index + 1}`,
        avatar: data.publicUrl,
      };
    });

    setAvailableAvatars(avatars);
  }, []);

  // ✅ Handle pemilihan profil
  const handleSelectProfile = (profile) => {
    setSelectedProfile(profile);
    localStorage.setItem("selected_profile", JSON.stringify(profile));
    setShowProfileModal(false);
  };

  const goToAdmin = () => {
    navigate("/admin");
  };

  return (
    <>
      {/* ================= TOMBOL SUARA ================= */}
      <button
        onClick={toggleAudio}
        className="absolute top-6 left-6 z-30 bg-white p-4 rounded-full shadow-lg text-[#ff6b6b] hover:scale-110 hover:shadow-xl transition-all duration-300 border-4 border-[#ff6b6b]/20"
      >
        {isPlaying ? (
          <FaVolumeUp size={24} />
        ) : (
          <FaVolumeMute size={24} className="text-gray-400" />
        )}
      </button>

      {/* ================= TOMBOL RAHASIA (MENYATU BACKGROUND) ================= */}
      <button
        onClick={goToAdmin}
        className="
          absolute top-0 right-0 z-40
          w-12 h-12
          bg-transparent
          cursor-pointer
        "
      ></button>

      {/* ================= PROFIL USER (BISA DIKLIK) ================= */}
      <div
        onClick={() => setShowProfileModal(true)}
        className="absolute top-6 right-6 z-30 bg-white/90 p-2 pr-5 rounded-full shadow-md flex items-center gap-3 border-4 border-white transition-all duration-300 hover:shadow-lg cursor-pointer hover:scale-105"
      >
        {selectedProfile ? (
          <>
            <img
              src={selectedProfile.avatar}
              alt="Avatar Profile"
              className="w-10 h-10 rounded-full object-cover bg-sky-50 border-2 border-amber-400"
            />
            <span className="font-bold text-slate-700 capitalize tracking-wide hidden md:block">
              {selectedProfile.name}
            </span>
            <FaUserEdit className="text-slate-400 text-sm hidden md:block" />
          </>
        ) : (
          <>
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-slate-300 flex items-center justify-center">
              <span className="text-slate-400 text-xs font-bold">?</span>
            </div>
            <span className="font-bold text-slate-500 hidden md:block">
              Pilih Profil
            </span>
            <FaUserEdit className="text-slate-400 text-sm hidden md:block" />
          </>
        )}
      </div>

      {/* ================= JUDUL ================= */}
      <div className="mb-14 z-20 relative mt-10">
        <Text
          textKey="title_main"
          variant="title"
          align="center"
          className="text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)] text-5xl font-black tracking-widest"
        />
      </div>

      {/* ================= MODAL PILIH PROFIL ================= */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full mx-4 animate-fade-in">
            <h2 className="text-2xl font-black text-slate-800 mb-2 text-center">
              Pilih Profil Kamu
            </h2>
            <p className="text-slate-500 text-sm mb-6 text-center">
              Pilih avatar yang kamu suka!
            </p>

            <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-6">
              {availableAvatars.map((profile) => (
                <div
                  key={profile.id}
                  onClick={() => handleSelectProfile(profile)}
                  className={`flex flex-col items-center p-4 rounded-2xl border-4 cursor-pointer transition-all duration-300 hover:scale-105 ${
                    selectedProfile?.id === profile.id
                      ? "border-amber-400 bg-amber-50"
                      : "border-slate-200 hover:border-sky-300 hover:bg-sky-50"
                  }`}
                >
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md mb-2"
                  />
                  <span className="font-bold text-slate-700 text-sm text-center">
                    {profile.name}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowProfileModal(false)}
              className="w-full py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-sky-400 to-blue-500 hover:shadow-lg transition-all"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default HomeHeader;
