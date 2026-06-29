import { useState, useRef, useCallback, useEffect } from "react";

/**
 * Custom hook untuk mengelola audio pada game membaca
 * Termasuk background music dan audio kata/suku kata dengan ducking effect
 * @returns {Object} - playAudio, playWord, playSyllable, stopAudio, isPlaying, cleanupAudio
 */
const usePartgameAudio = () => {
  const audioRef = useRef(null); // Ref untuk audio kata/suku kata
  const bgmRef = useRef(null); // Ref untuk background music
  const [isPlaying, setIsPlaying] = useState(false);

  // Normal volume dan Ducked (mengecil) volume
  const NORMAL_VOLUME = 0.5;
  const DUCKED_VOLUME = 0.1;

  // Inisialisasi Background Music saat komponen pertama kali dirender
  useEffect(() => {
    bgmRef.current = new Audio("/aud/backsound.mp3");
    bgmRef.current.loop = true;
    bgmRef.current.volume = NORMAL_VOLUME;

    // Memutar backsound (bisa jadi diblokir browser jika belum ada interaksi user)
    bgmRef.current.play().catch(() => {
      console.log(
        "Backsound autoplay diblokir oleh browser sampai user berinteraksi",
      );
    });

    // Membersihkan backsound saat user pindah/keluar dari halaman partgame
    return () => {
      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current = null;
      }
    };
  }, []);

  // Fungsi untuk memutar audio dari URL (kata atau suku kata)
  const playAudio = useCallback((url) => {
    if (!url) {
      console.warn("⚠️ Audio URL tidak tersedia");
      return;
    }

    // Hentikan audio sebelumnya jika masih bermain
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(url);
    audioRef.current = audio;
    setIsPlaying(true);

    // 1. Kecilkan suara backsound saat audio diputar
    if (bgmRef.current) {
      bgmRef.current.volume = DUCKED_VOLUME;
    }

    audio
      .play()
      .then(() => {
        console.log("🔊 Audio bermain:", url);
      })
      .catch((err) => {
        console.error("❌ Gagal memutar audio:", err);
        setIsPlaying(false);
      });

    // 2. Kembalikan suara backsound jika audio selesai
    audio.onended = () => {
      setIsPlaying(false);
      if (bgmRef.current) {
        bgmRef.current.volume = NORMAL_VOLUME;
      }
      audioRef.current = null;
    };

    audio.onerror = () => {
      setIsPlaying(false);
      if (bgmRef.current) {
        bgmRef.current.volume = NORMAL_VOLUME;
      }
      audioRef.current = null;
    };
  }, []);

  // Fungsi untuk memutar audio kata utuh
  const playWord = useCallback(
    (audioUrl) => {
      playAudio(audioUrl);
    },
    [playAudio],
  );

  // Fungsi untuk memutar audio suku kata (jika tersedia)
  const playSyllable = useCallback(
    (syllable, baseAudioUrl) => {
      // Untuk saat ini, kita putar audio kata utuh
      // Nanti bisa dikembangkan dengan audio per suku kata
      playAudio(baseAudioUrl);
    },
    [playAudio],
  );

  // Fungsi untuk menghentikan audio
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
      setIsPlaying(false);
    }

    // Kembalikan suara backsound menjadi normal
    if (bgmRef.current) {
      bgmRef.current.volume = NORMAL_VOLUME;
    }
  }, []);

  // Fungsi untuk membersihkan semua audio saat user keluar dari halaman
  const cleanupAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (bgmRef.current) {
      bgmRef.current.pause();
      bgmRef.current = null;
    }
  }, []);

  return {
    playAudio,
    playWord,
    playSyllable,
    stopAudio,
    cleanupAudio,
    isPlaying,
  };
};

export default usePartgameAudio;
