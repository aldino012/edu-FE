import React from "react";

// URL dikemas kini untuk halakan ke folder 'images' di dalam bucket 'assets-fe'
const SUPABASE_BUCKET_URL =
  "https://ruvbopxooqgscpwadipr.supabase.co/storage/v1/object/public/assets-fe/images";

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
          src={`${SUPABASE_BUCKET_URL}/awan.png`}
          alt="Awan Kiri"
          className="w-64 h-auto opacity-90"
        />

        <img
          src={`${SUPABASE_BUCKET_URL}/matahari.webp`}
          alt="Matahari Animasi"
          className="w-48 h-auto"
        />

        <img
          src={`${SUPABASE_BUCKET_URL}/awan.png`}
          alt="Awan Kanan"
          className="w-64 h-auto opacity-90"
        />
      </div>

      {/* ================= BURUNG ================= */}
      <img
        src={`${SUPABASE_BUCKET_URL}/burung.webp`}
        alt="Burung Terbang"
        className="absolute top-36 w-28 h-auto opacity-90 z-0 animate-fly pointer-events-none"
      />

      {/* ================= RUMPUT ================= */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <img
          src={`${SUPABASE_BUCKET_URL}/rumput.png`}
          alt="Rumput Background"
          className="w-full h-full object-cover object-bottom"
        />
      </div>

      {/* ================= KIRI ================= */}
      <img
        src={`${SUPABASE_BUCKET_URL}/pohon.webp`}
        alt="Pohon Kiri"
        className="absolute bottom-0 left-[-2rem] w-56 md:w-64 h-auto pointer-events-none z-10"
      />

      <img
        src={`${SUPABASE_BUCKET_URL}/bunga.webp`}
        alt="Bunga Kiri"
        className="absolute bottom-6 left-[18%] w-16 md:w-20 h-auto pointer-events-none z-10"
      />

      <img
        src={`${SUPABASE_BUCKET_URL}/kelinci.webp`}
        alt="Kelinci Kiri"
        className="absolute bottom-6 left-[30%] w-20 md:w-24 h-auto pointer-events-none z-10"
      />

      {/* ================= KANAN ================= */}
      <img
        src={`${SUPABASE_BUCKET_URL}/pohon.webp`}
        alt="Pohon Kanan"
        className="absolute bottom-0 right-[-2rem] w-56 md:w-64 h-auto pointer-events-none z-10 transform -scale-x-100"
      />

      <img
        src={`${SUPABASE_BUCKET_URL}/kucing.webp`}
        alt="Kucing Kanan"
        className="absolute bottom-6 right-[18%] w-20 md:w-24 h-auto pointer-events-none z-10"
      />

      <img
        src={`${SUPABASE_BUCKET_URL}/kelinci2.webp`}
        alt="Kelinci Kanan"
        className="absolute bottom-6 right-[35%] w-20 md:w-24 h-auto pointer-events-none z-10"
      />

      <img
        src={`${SUPABASE_BUCKET_URL}/kupu-kupu.webp`}
        alt="Kupu-Kupu"
        className="absolute bottom-64 right-[8%] w-16 h-auto pointer-events-none z-10 animate-float"
      />
    </>
  );
};

export default HomeDecorations;
