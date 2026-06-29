import React from "react";
import { useNavigate } from "react-router-dom";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import Text from "../../../components/Text";

const HomeHeader = ({ audioRef, isPlaying, toggleAudio, userProfile }) => {
  const navigate = useNavigate();

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

      {/* ================= PROFIL USER ================= */}
      <div className="absolute top-6 right-6 z-30 bg-white/90 p-2 pr-5 rounded-full shadow-md flex items-center gap-3 border-4 border-white transition-all duration-300 hover:shadow-lg">
        {userProfile ? (
          <>
            <img
              src={userProfile.avatar}
              alt="Avatar Profile"
              className="w-10 h-10 rounded-full object-cover bg-sky-50 border-2 border-amber-400"
            />
            <span className="font-bold text-slate-700 capitalize tracking-wide hidden md:block">
              {userProfile.name}
            </span>
          </>
        ) : (
          <>
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-slate-300 flex items-center justify-center">
              <span className="text-slate-400 text-xs font-bold">?</span>
            </div>
            <span className="font-bold text-slate-500 hidden md:block">
              Tamu
            </span>
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
    </>
  );
};

export default HomeHeader;