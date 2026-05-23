import React from "react";

const HomeDecorations = () => {
  return (
    <>
      {/* ================= ANIMASI CUSTOM ================= */}
      <style>
        {`
          @keyframes flyRightToLeft {
            0% { left: 110%; }
            100% { left: -20%; }
          }

          .animate-fly {
            animation: flyRightToLeft 12s linear infinite;
          }

          @keyframes floatUpDown {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
          }

          .animate-float {
            animation: floatUpDown 3s ease-in-out infinite;
          }
        `}
      </style>

      {/* ================= LANGIT ================= */}
      <div className="absolute top-4 left-0 w-full flex justify-center items-center gap-24 z-0 px-20">
        <img
          src="/images/awan.png"
          alt="Awan Kiri"
          className="w-64 h-auto opacity-90"
        />

        <img
          src="/images/matahari.gif"
          alt="Matahari Animasi"
          className="w-48 h-auto"
        />

        <img
          src="/images/awan.png"
          alt="Awan Kanan"
          className="w-64 h-auto opacity-90"
        />
      </div>

      {/* ================= BURUNG ================= */}
      <img
        src="/images/burung.gif"
        alt="Burung Terbang"
        className="absolute top-36 w-28 h-auto opacity-90 z-0 animate-fly pointer-events-none"
      />

      {/* ================= RUMPUT ================= */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <img
          src="/images/rumput.png"
          alt="Rumput Background"
          className="w-full h-full object-cover object-bottom"
        />
      </div>

      {/* ================= KIRI ================= */}
      <img
        src="/images/pohon.gif"
        alt="Pohon Kiri"
        className="absolute bottom-0 left-[-2rem] w-56 md:w-64 h-auto pointer-events-none z-10"
      />

      <img
        src="/images/bunga.gif"
        alt="Bunga Kiri"
        className="absolute bottom-6 left-[18%] w-16 md:w-20 h-auto pointer-events-none z-10"
      />

      <img
        src="/images/kelinci.gif"
        alt="Kelinci Kiri"
        className="absolute bottom-6 left-[30%] w-20 md:w-24 h-auto pointer-events-none z-10"
      />

      {/* ================= KANAN ================= */}
      <img
        src="/images/pohon.gif"
        alt="Pohon Kanan"
        className="absolute bottom-0 right-[-2rem] w-56 md:w-64 h-auto pointer-events-none z-10 transform -scale-x-100"
      />

      <img
        src="/images/kucing.gif"
        alt="Kucing Kanan"
        className="absolute bottom-6 right-[18%] w-20 md:w-24 h-auto pointer-events-none z-10"
      />

      <img
        src="/images/kelinci2.gif"
        alt="Kelinci Kanan"
        className="absolute bottom-6 right-[35%] w-20 md:w-24 h-auto pointer-events-none z-10"
      />

      <img
        src="/images/kupu-kupu.gif"
        alt="Kupu-Kupu"
        className="absolute bottom-64 right-[8%] w-16 h-auto pointer-events-none z-10 animate-float"
      />
    </>
  );
};

export default HomeDecorations;