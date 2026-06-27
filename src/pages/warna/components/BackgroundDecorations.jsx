import React, { useMemo } from "react";
import { FaStar, FaCircle, FaHeart, FaSmile } from "react-icons/fa";
import { LuRainbow, LuFlower } from "react-icons/lu";

// URL Supabase untuk folder 'images' di dalam bucket 'assets-fe'
const SUPABASE_BUCKET_URL =
  "https://ruvbopxooqgscpwadipr.supabase.co/storage/v1/object/public/assets-fe/images";

const BackgroundDecorations = () => {
  // Membuat partikel acak (Pelangi, Bintang, Lingkaran) yang tersebar di background
  const particles = useMemo(() => {
    const items = [];
    const types = [
      "rainbow",
      "star",
      "heart",
      "flower",
      "smile",
      "dot",
      "dot",
      "dot",
    ];
    for (let i = 0; i < 50; i++) {
      items.push({
        id: i,
        type: types[Math.floor(Math.random() * types.length)],
        top: `${Math.floor(Math.random() * 100)}%`,
        left: `${Math.floor(Math.random() * 100)}%`,
        size: Math.floor(Math.random() * 20) + 10,
        rotate: `${Math.floor(Math.random() * 360)}deg`,
        opacity: (Math.random() * 0.2 + 0.1).toFixed(2),
        duration: `${3 + Math.random() * 4}s`,
        delay: `${Math.random() * 5}s`,
      });
    }
    return items;
  }, []);

  return (
    <>
      {/* GRADIENT BACKGROUND UTAMA */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)",
          backgroundSize: "200% 200%",
          animation: "gradientShift 10s ease infinite",
        }}
      />

      {/* SOFT OVERLAY AGAR TIDAK TERLALU TERANG */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.15) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* CUTE PATTERN OVERLAY (Polkadot) */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20px 30px, rgba(255,255,255,0.15) 2px, transparent 2px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* 1. OVERLAY PARTIKEL ACAK (Z-0) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {particles.map((p) => {
          const style = {
            position: "absolute",
            top: p.top,
            left: p.left,
            transform: `rotate(${p.rotate})`,
            opacity: p.opacity,
            color: "white",
            animationName: "float",
            animationDuration: p.duration,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationDelay: p.delay,
          };

          if (p.type === "rainbow")
            return <LuRainbow key={p.id} style={style} size={p.size} />;
          if (p.type === "star")
            return <FaStar key={p.id} style={style} size={p.size} />;
          if (p.type === "heart")
            return <FaHeart key={p.id} style={style} size={p.size} />;
          if (p.type === "flower")
            return <LuFlower key={p.id} style={style} size={p.size} />;
          if (p.type === "smile")
            return <FaSmile key={p.id} style={style} size={p.size} />;
          return <FaCircle key={p.id} style={style} size={p.size * 0.6} />;
        })}
      </div>

      {/* 2. LAYER RUMPUT (Z-10) */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          backgroundImage: `url('${SUPABASE_BUCKET_URL}/rumput3.png')`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "bottom center",
          backgroundSize: "100% auto",
        }}
      ></div>

      {/* 3. LAYER ASET LINGKUNGAN (Z-20 & Z-30) */}
      <img
        src={`${SUPABASE_BUCKET_URL}/bunga-w.png`}
        alt="Bunga"
        className="absolute bottom-8 left-8 w-32 z-30 pointer-events-none"
      />
      <img
        src={`${SUPABASE_BUCKET_URL}/unicorn.png`}
        alt="Unicorn"
        className="absolute bottom-8 left-1/3 w-56 z-20 pointer-events-none"
      />
      <div className="absolute bottom-8 right-8 w-[500px] h-[300px] pointer-events-none z-20">
        <img
          src={`${SUPABASE_BUCKET_URL}/semanggi.png`}
          alt="Semanggi 1"
          className="absolute right-[280px] bottom-4 w-16 z-10"
        />
        <img
          src={`${SUPABASE_BUCKET_URL}/semanggi.png`}
          alt="Semanggi 2"
          className="absolute right-[230px] bottom-8 w-12 z-10"
        />
        <img
          src={`${SUPABASE_BUCKET_URL}/semanggi.png`}
          alt="Semanggi 3"
          className="absolute right-[180px] bottom-2 w-16 z-10"
        />
        <img
          src={`${SUPABASE_BUCKET_URL}/tong.png`}
          alt="Tong Emas"
          className="absolute right-0 bottom-0 w-64 z-20"
        />
        <img
          src={`${SUPABASE_BUCKET_URL}/lep.png`}
          alt="Karakter Leprechaun"
          className="absolute right-[220px] bottom-0 w-36 z-30"
        />
      </div>

      {/* CSS ANIMATIONS */}
      <style>{`
        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </>
  );
};

export default BackgroundDecorations;
