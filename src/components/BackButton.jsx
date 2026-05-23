// src/components/BackButton.jsx
import React from "react";
import { FaArrowLeft } from "react-icons/fa";

const BackButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed top-6 left-28 md:top-10 md:left-52 z-50 bg-white hover:bg-slate-50 text-[#FF6B6B] w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg border-b-4 border-slate-200 transition-all hover:scale-105 active:scale-95"
      title="Kembali ke Beranda"
    >
      <FaArrowLeft className="text-lg md:text-xl" />
    </button>
  );
};

export default BackButton;