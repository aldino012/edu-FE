// Konfigurasi untuk fitur "Ayo Membaca"
export const PARTGAME_CONFIG = {
  TITLE: "Ayo Membaca",
  SUBTITLE: "Pilih suku kata yang benar!",
  API_ENDPOINT: "/partgame/read",
};

// Warna-warna untuk kartu suku kata
export const SYLLABLE_COLORS = [
  "bg-red-400",
  "bg-blue-400",
  "bg-green-400",
  "bg-yellow-400",
  "bg-purple-400",
  "bg-pink-400",
  "bg-indigo-400",
  "bg-orange-400",
];

// Status game
export const GAME_STATUS = {
  IDLE: "idle",
  PLAYING: "playing",
  CORRECT: "correct",
  WRONG: "wrong",
  COMPLETED: "completed",
};

// Pesan feedback
export const FEEDBACK_MESSAGES = {
  CORRECT: ["Hebat! 🎉", "Benar sekali! ⭐", "Pintar! 👏", "Luar biasa! 🌟"],
  WRONG: ["Coba lagi! 💪", "Hampir benar! 🤔", "Semangat! 🔥"],
};
