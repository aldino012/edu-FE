import { useRef, useEffect, useCallback } from "react";

const useAudio = () => {
  const audioRef = useRef(null);
  const bgmRef = useRef(null); // Ref untuk background music

  const NORMAL_VOLUME = 0.5;
  const DUCKED_VOLUME = 0.1;

  // Inisialisasi Backsound
  useEffect(() => {
    bgmRef.current = new Audio("/aud/backsound.mp3");
    bgmRef.current.loop = true;
    bgmRef.current.volume = NORMAL_VOLUME;

    bgmRef.current.play().catch((e) => console.log("BGM diblokir:", e));

    // Cleanup BGM saat komponen di-unmount
    return () => {
      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current = null;
      }
    };
  }, []);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Kembalikan volume backsound saat audio efek dihentikan manual
    if (bgmRef.current) {
      bgmRef.current.volume = NORMAL_VOLUME;
    }
  }, []);

  const playAudio = useCallback(
    (url) => {
      stopAudio(); // Hentikan audio sebelumnya jika ada

      if (url) {
        audioRef.current = new Audio(url);

        // 1. Kecilkan suara backsound
        if (bgmRef.current) {
          bgmRef.current.volume = DUCKED_VOLUME;
        }

        // 2. Kembalikan volume secara otomatis jika audio selesai
        audioRef.current.onended = () => {
          if (bgmRef.current) {
            bgmRef.current.volume = NORMAL_VOLUME;
          }
        };

        audioRef.current.play().catch((e) => console.log("Audio diblokir:", e));
      }
    },
    [stopAudio], // Dependency array memuat stopAudio
  );

  // Cleanup: matikan audio efek saat komponen di-unmount
  useEffect(() => {
    return () => stopAudio();
  }, [stopAudio]);

  return { playAudio, stopAudio };
};

export default useAudio;
