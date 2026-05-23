import { useEffect, useRef, useState } from "react";

const useHomeAudio = () => {
  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4;

      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          console.log(
            "Autoplay diblokir oleh browser. User harus klik tombol play.",
          );

          setIsPlaying(false);
        });
    }
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }

      setIsPlaying(!isPlaying);
    }
  };

  return {
    audioRef,
    isPlaying,
    toggleAudio,
  };
};

export default useHomeAudio;