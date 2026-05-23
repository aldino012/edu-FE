import React from "react";
import { FaVolumeUp } from "react-icons/fa";

const HurufCard = ({ item, flippedCard, onFlip }) => {
  return (
    <div
      className="relative w-full aspect-[4/5] cursor-pointer group [perspective:1000px]"
      onClick={() => onFlip(item.id, item.audio_url)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] shadow-sm hover:shadow-xl rounded-2xl md:rounded-3xl ${
          flippedCard === item.id ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* FRONT */}
        <div className="absolute inset-0 [backface-visibility:hidden] bg-[#FFFDF0] rounded-2xl md:rounded-3xl flex flex-col items-center justify-center border-b-[6px] border-[#FFD166]">
          <div className="absolute top-3 left-4 flex items-baseline gap-1">
            <span className="text-sm md:text-lg font-bold text-slate-700">
              {item.value?.toUpperCase()}
            </span>
            <span className="text-xs md:text-sm font-semibold text-slate-700">
              {item.value?.toLowerCase()}
            </span>
          </div>

          <span className="text-6xl md:text-8xl font-black text-[#FF6B6B] drop-shadow-sm select-none">
            {item.value}
          </span>
        </div>

        {/* BACK */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-[#FFFDF0] rounded-2xl md:rounded-3xl flex flex-col items-center justify-center p-4 border-b-[6px] border-[#FFD166]">
          <div className="absolute top-3 left-4">
            <FaVolumeUp className="text-slate-300 text-lg md:text-xl" />
          </div>

          <img
            src={item.image_url}
            alt={item.label}
            className="w-20 h-20 md:w-32 md:h-32 object-contain drop-shadow-md mb-2"
          />

          <span className="font-bold text-slate-700 text-base md:text-xl text-center capitalize">
            {item.label}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HurufCard;