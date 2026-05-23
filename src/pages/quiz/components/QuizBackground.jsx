import React, { useMemo } from "react";
import { FaStar, FaCircle } from "react-icons/fa";

const QuizBackground = () => {
  // Logika pembuatan partikel dipindah ke sini agar tidak membebani hook utama
  const particles = useMemo(() => {
    const items = [];
    const types = ["star", "dot", "dot"];
    for (let i = 0; i < 30; i++) {
      items.push({
        id: i,
        type: types[Math.floor(Math.random() * types.length)],
        top: `${Math.floor(Math.random() * 100)}%`,
        left: `${Math.floor(Math.random() * 100)}%`,
        size: Math.floor(Math.random() * 20) + 15,
        rotate: `${Math.floor(Math.random() * 360)}deg`,
        opacity: (Math.random() * 0.15 + 0.05).toFixed(2),
      });
    }
    return items;
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {particles.map((p) => {
        const style = {
          position: "absolute",
          top: p.top,
          left: p.left,
          transform: `rotate(${p.rotate})`,
          opacity: p.opacity,
          color: "white",
        };
        return p.type === "star" ? (
          <FaStar key={p.id} style={style} size={p.size} />
        ) : (
          <FaCircle key={p.id} style={style} size={p.size * 0.8} />
        );
      })}
    </div>
  );
};

export default QuizBackground;
