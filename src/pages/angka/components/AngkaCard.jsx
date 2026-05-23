import React from "react";
import { TbCandy } from "react-icons/tb";
import { candyColors } from "../constants/angkaConstants";

const AngkaCard = ({ item, isFlipped, onClick }) => {
  return (
    <div
      className="relative w-full aspect-[3/4] max-w-[140px] perspective-1000 cursor-pointer group"
      onClick={() => onClick(item)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
          isFlipped ? "rotate-y-180" : "group-hover:-translate-y-2"
        }`}
      >
        {/* FRONT */}
        <div className="absolute w-full h-full backface-hidden bg-white rounded-3xl shadow-[0_10px_20px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center border-b-8 border-emerald-200 p-2">
          <span className="text-6xl md:text-7xl font-black text-emerald-600 drop-shadow-sm">
            {item.value}
          </span>

          <span className="text-sm md:text-base font-bold text-slate-500 mt-2 text-center uppercase tracking-wider">
            {item.label}
          </span>
        </div>

        {/* BACK */}
        <div className="absolute w-full h-full backface-hidden bg-white rounded-3xl shadow-[0_10px_20px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center p-3 rotate-y-180 border-b-8 border-orange-300">
          <div className="flex-1 w-full flex flex-wrap content-center justify-center gap-1 overflow-hidden py-1">
            {parseInt(item.value) === 0 ? (
              <span className="text-slate-300 font-bold text-lg">Kosong</span>
            ) : (
              <>
                {Array.from({
                  length: Math.min(parseInt(item.value), 25),
                }).map((_, i) => (
                  <TbCandy
                    key={i}
                    className={`text-2xl md:text-3xl ${
                      candyColors[i % candyColors.length]
                    }`}
                  />
                ))}

                {parseInt(item.value) > 25 && (
                  <span className="w-full text-center text-xs font-bold text-orange-500 mt-1">
                    + {parseInt(item.value) - 25} Lagi
                  </span>
                )}
              </>
            )}
          </div>

          <span className="text-slate-700 font-black text-xl bg-orange-100 px-3 py-1 rounded-full mt-2">
            {item.value}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AngkaCard;
