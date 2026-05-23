import React from "react";
import Card from "../../../components/Card"; // Sesuaikan path relative ke komponen global Anda
import Text from "../../../components/Text"; // Sesuaikan path relative ke komponen global Anda
import { FaVolumeUp } from "react-icons/fa";

// Fungsi helper dipindah ke luar komponen agar tidak dirender ulang terus-menerus
const getContrastColor = (hexcolor) => {
  if (!hexcolor) return "text-white";
  const hex = hexcolor.replace("#", "");
  const r = parseInt(hex, 16) >> 16;
  const g = (parseInt(hex, 16) >> 8) & 255;
  const b = parseInt(hex, 16) & 255;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "text-slate-900" : "text-white";
};

const ColorCard = ({ item, onClick }) => {
  const textColorClass = getContrastColor(item.value);

  return (
    <Card
      onClick={onClick}
      className="relative w-full aspect-square rounded-[35px] shadow-lg hover:scale-110 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-pointer border-[4px] border-white p-0 overflow-hidden group"
    >
      {/* Background Warna Penuh */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ backgroundColor: item.value }}
      ></div>

      {/* Konten Text dan Icon di atas warna */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        {/* Icon Speaker benar-benar menempel di pojok kiri atas */}
        <div
          className={`absolute top-4 left-4 ${textColorClass} opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all`}
        >
          <FaVolumeUp size={20} />
        </div>

        {/* Nama Warna */}
        <Text
          variant="h2"
          className={`font-black uppercase tracking-wider text-xl sm:text-2xl ${textColorClass} drop-shadow-sm`}
        >
          {item.label}
        </Text>
      </div>
    </Card>
  );
};

export default ColorCard;