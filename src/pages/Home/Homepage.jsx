import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import useHomeAudio from "./hooks/useHomeAudio";

import HomeAudio from "./components/HomeAudio";
import HomeHeader from "./components/HomeHeader";
import HomeDecorations from "./components/HomeDecorations";
import HomeMenu from "./components/HomeMenu";
import ProfilePopup from "./components/ProfilePopup";

const Homepage = () => {
  const navigate = useNavigate();
  const { audioRef, isPlaying, toggleAudio } = useHomeAudio();

  // State untuk menyimpan data profil dan mengontrol popup
  const [userProfile, setUserProfile] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // Mengecek local storage saat pertama kali halaman dimuat
  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile)); // Jika ada, masukkan ke state
    } else {
      setShowPopup(true); // Jika belum ada, munculkan popup
    }
  }, []);

  // Fungsi untuk menangani saat user mengklik "Mulai Bermain" di popup
  const handleProfileSave = (data) => {
    setUserProfile(data); // Update state dengan data baru (nama & avatar)
    setShowPopup(false); // Tutup popup
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4bc0f8] via-[#8ce0ff] to-[#d6f5ff] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Komponen Audio */}
      <HomeAudio audioRef={audioRef} />

      {/* Menampilkan Popup jika showPopup bernilai true */}
      {showPopup && <ProfilePopup onSave={handleProfileSave} />}

      {/* Header sekarang menerima props userProfile */}
      <HomeHeader
        audioRef={audioRef}
        isPlaying={isPlaying}
        toggleAudio={toggleAudio}
        userProfile={userProfile}
      />

      {/* Dekorasi (Pohon, rumput, hewan, awan) */}
      <HomeDecorations />

      {/* Menu Navigasi Utama */}
      {/* HomeMenu akan menangani navigasi ke /huruf, /partgame, /angka, /warna, /quiz */}
      <HomeMenu />
    </div>
  );
};

export default Homepage;
