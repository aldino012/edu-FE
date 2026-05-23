import { useRef, useEffect } from "react";

export const useAngkaAudio = () => {
  const audioRef = useRef(null);
  const bgmRef = useRef(null); // Ref untuk background music

  // Atur batas volume normal dan saat mengecil
  const NORMAL_VOLUME = 0.5;
  const DUCKED_VOLUME = 0.1;

  // Inisialisasi Backsound saat halaman angka dibuka
  useEffect(() => {
    bgmRef.current = new Audio("/aud/backsound.mp3");
    bgmRef.current.loop = true; // Musik berulang
    bgmRef.current.volume = NORMAL_VOLUME;

    // Putar backsound
    bgmRef.current.play().catch((err) => {
      console.warn("Backsound autoplay diblokir oleh browser:", err);
    });

    // Cleanup saat keluar dari halaman
    return () => {
      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current = null;
      }
    };
  }, []);

  const playAudio = (url) => {
    stopAudio(); // pastikan tidak ada audio lain yang jalan

    if (url) {
      audioRef.current = new Audio(url);

      // 1. Turunkan volume backsound saat audio angka mulai
      if (bgmRef.current) {
        bgmRef.current.volume = DUCKED_VOLUME;
      }

      // 2. Kembalikan volume backsound otomatis jika audio angka selesai
      audioRef.current.onended = () => {
        if (bgmRef.current) {
          bgmRef.current.volume = NORMAL_VOLUME;
        }
      };

      audioRef.current.play().catch((err) => {
        console.warn("Audio gagal diputar:", err);
      });
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    // Kembalikan volume backsound menjadi normal jika distop paksa
    if (bgmRef.current) {
      bgmRef.current.volume = NORMAL_VOLUME;
    }
  };

  const cleanupAudio = () => {
    stopAudio();
    // Pastikan backsound juga dibersihkan saat cleanup manual dipanggil
    if (bgmRef.current) {
      bgmRef.current.pause();
      bgmRef.current = null;
    }
  };

  return {
    playAudio,
    stopAudio,
    cleanupAudio,
  };
};
