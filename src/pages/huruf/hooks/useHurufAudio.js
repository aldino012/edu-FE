import { useRef, useState, useEffect } from "react";

const useHurufAudio = () => {
  const audioRef = useRef(null); // Ref untuk suara instruksi/kartu
  const bgmRef = useRef(null); // Ref untuk background music
  const [flippedCard, setFlippedCard] = useState(null);

  // Normal volume dan Ducked (mengecil) volume
  const NORMAL_VOLUME = 0.5;
  const DUCKED_VOLUME = 0.1;

  // Inisialisasi Backsound saat komponen pertama kali dirender
  useEffect(() => {
    bgmRef.current = new Audio("/aud/backsound.mp3");
    bgmRef.current.loop = true; // Agar musik berulang terus
    bgmRef.current.volume = NORMAL_VOLUME;

    // Memutar backsound (bisa jadi diblokir browser jika belum ada interaksi user)
    bgmRef.current.play().catch(() => {
      console.log(
        "Backsound autoplay diblokir oleh browser sampai user berinteraksi",
      );
    });

    // Membersihkan backsound saat user pindah/keluar dari halaman huruf
    return () => {
      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current = null;
      }
    };
  }, []);

  const playAudio = (url) => {
    // Stop audio kartu yang sedang berjalan (jika ada)
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    if (url) {
      audioRef.current = new Audio(url);

      // 1. Kecilkan suara backsound saat kartu diputar
      if (bgmRef.current) {
        bgmRef.current.volume = DUCKED_VOLUME;
      }

      // 2. Kembalikan suara backsound jika audio kartu selesai (opsional, untuk jaga-jaga jika kartu tidak ditutup)
      audioRef.current.onended = () => {
        if (bgmRef.current) {
          bgmRef.current.volume = NORMAL_VOLUME;
        }
      };

      audioRef.current.play().catch(() => {
        console.log("Audio diblokir");
      });
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Kembalikan suara backsound menjadi normal saat kartu ditutup
    if (bgmRef.current) {
      bgmRef.current.volume = NORMAL_VOLUME;
    }
  };

  const handleFlip = (id, audioUrl) => {
    if (flippedCard === id) {
      // Jika kartu yang sama diklik (ditutup)
      setFlippedCard(null);
      stopAudio();
    } else {
      // Jika kartu baru diklik (dibuka)
      setFlippedCard(id);
      playAudio(audioUrl);
    }
  };

  const cleanupAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (bgmRef.current) {
      bgmRef.current.pause();
      bgmRef.current = null;
    }
  };

  return {
    flippedCard,
    handleFlip,
    stopAudio,
    cleanupAudio,
  };
};

export default useHurufAudio;