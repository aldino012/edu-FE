import React from "react";
import {
  FaShapes,
  FaSortNumericDown,
  FaPalette,
  FaPuzzlePiece,
  FaBookOpen,
} from "react-icons/fa";

export const menus = [
  {
    id: "huruf",
    textKey: "card_huruf",
    bgColor: "bg-[#ff6b6b]",
    shadow: "shadow-red-400/50",
    display: "A B C",
    icon: <FaShapes className="text-3xl text-white mb-2" />,
  },
  {
    id: "membaca",
    textKey: "AYO MEMBACA",
    bgColor: "bg-[#a855f7]",
    shadow: "shadow-purple-400/50",
    // Kita jadikan elemen JSX: paksa 1 baris (whitespace-nowrap) dan kurangi jarak huruf (tracking-normal)
    display: (
      <div className="whitespace-nowrap tracking-normal text-2xl md:text-[1.65rem] mt-1">
        BA-CA
      </div>
    ),
    icon: <FaBookOpen className="text-3xl text-white mb-2" />,
    isDisabled: true,
  },
  {
    id: "angka",
    textKey: "card_angka",
    bgColor: "bg-[#4dabf7]",
    shadow: "shadow-blue-400/50",
    display: "1 2 3",
    icon: <FaSortNumericDown className="text-3xl text-white mb-2" />,
  },
  {
    id: "warna",
    textKey: "card_warna",
    bgColor: "bg-[#51cf66]",
    shadow: "shadow-green-400/50",
    display: (
      <div className="flex gap-3 justify-center items-center mt-1">
        <div className="w-7 h-7 rounded-full bg-red-500 border-2 border-white shadow-sm"></div>
        <div className="w-7 h-7 rounded-full bg-yellow-400 border-2 border-white shadow-sm"></div>
        <div className="w-7 h-7 rounded-full bg-blue-500 border-2 border-white shadow-sm"></div>
      </div>
    ),
    icon: <FaPalette className="text-3xl text-white mb-2" />,
  },
  {
    id: "quiz",
    textKey: "card_quiz",
    bgColor: "bg-[#fcc419]",
    shadow: "shadow-yellow-400/50",
    display: "A ? 3",
    icon: <FaPuzzlePiece className="text-3xl text-white mb-2" />,
  },
];