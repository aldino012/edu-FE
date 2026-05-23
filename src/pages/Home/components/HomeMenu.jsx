import React from "react";
import { useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa6"; // Import icon gembok resmi dari fa6

import Card from "../../../components/Card";
import Text from "../../../components/Text";

import { menus } from "../constants/menus";

const HomeMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap justify-center gap-8 z-20 relative px-4">
      {menus.map((menu) => (
        <Card
          key={menu.id}
          // Cek jika nonaktif, jangan jalankan navigasi
          onClick={() => !menu.isDisabled && navigate(`/${menu.id}`)}
          className="!p-0 !bg-transparent border-none shadow-none"
        >
          <div
            // KUNCI KERAPIAN: Tambahkan `h-48` agar tinggi semua kotak sama rata
            // Tambahan: Logika untuk style tombol nonaktif vs aktif
            className={`
              ${menu.bgColor} ${menu.shadow} 
              flex flex-col items-center justify-center p-6 w-48 h-48 rounded-[2rem] shadow-xl border-4 border-white/90 transform transition-all duration-300 relative
              ${menu.isDisabled 
                ? "opacity-60 cursor-not-allowed grayscale" // Style jika nonaktif (redup)
                : "hover:scale-110 hover:-translate-y-3 cursor-pointer group" // Style jika aktif
              }
            `}
          >
            {/* Bagian Icon */}
            <div className={`transform transition-transform duration-300 ${!menu.isDisabled && "group-hover:-translate-y-2 group-hover:rotate-12"}`}>
              {menu.icon}
            </div>

            {/* Bagian Judul Text */}
            <Text
              textKey={menu.id === 'membaca' ? menu.textKey : menu.textKey} // Jika pakai i18n, pastikan key-nya aman
              variant="subtitle"
              align="center"
              // Tambahkan leading-tight agar jarak antar baris tidak terlalu jauh jika teks turun ke bawah
              className="text-white font-bold opacity-90 tracking-wide text-sm mb-1 leading-tight"
            />

            {/* Bagian Display Utama */}
            <div className="text-2xl md:text-3xl font-black text-white tracking-widest drop-shadow-md mt-1">
              {menu.display}
            </div>

            {/* Label visual gembok dengan React Icons untuk menu nonaktif */}
            {menu.isDisabled && (
              <span className="absolute top-4 right-4 bg-black/30 text-white p-1.5 rounded-full shadow-inner">
                <FaLock className="text-xs text-white drop-shadow" />
              </span>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default HomeMenu;