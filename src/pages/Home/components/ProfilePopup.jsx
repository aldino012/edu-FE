// src/Home/components/ProfilePopup.jsx
import { useState } from "react";

export default function ProfilePopup({ onSave }) {
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("Avatar1.png");

    const avatars = [
      "Avatar1.png",
      "Avatar2.png",
      "Avatar3.png",
      "Avatar4.png",
      "Avatar5.png",
    ];

  const handleSave = () => {
    if (!name.trim()) {
      alert("Namanya diisi dulu ya!");
      return;
    }
    const userData = {
      name: name,
      avatar: `/images/${selectedAvatar}`,
    };

    localStorage.setItem("userProfile", JSON.stringify(userData));
    onSave(userData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 text-center max-w-md w-full shadow-2xl border-4 border-amber-400 transform transition-all">
        {/* Judul */}
        <h2 className="text-2xl font-black text-slate-700 mb-6 tracking-wide">
          Halo! Siapa namamu?
        </h2>

        {/* Grid / Pilihan Avatar */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {avatars.map((av) => {
            const isSelected = selectedAvatar === av;
            return (
              <img
                key={av}
                src={`/images/${av}`}
                alt="Avatar"
                onClick={() => setSelectedAvatar(av)}
                className={`w-20 h-20 rounded-full cursor-pointer border-4 bg-sky-50 object-cover transition-all duration-200 transform hover:scale-110 ${
                  isSelected
                    ? "border-green-500 scale-105 shadow-lg ring-4 ring-green-100"
                    : "border-slate-200 hover:border-amber-300"
                }`}
              />
            );
          })}
        </div>

        {/* Input Nama */}
        <input
          type="text"
          placeholder="Ketik namamu di sini..."
          value={name}
          maxLength={15}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-5 py-3 rounded-2xl border-2 border-slate-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 focus:outline-none mb-6 text-center text-xl font-bold text-slate-700 placeholder-slate-400 transition-all"
        />

        {/* Tombol Simpan */}
        <button
          onClick={handleSave}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold py-4 px-6 rounded-2xl text-xl shadow-md hover:shadow-xl transform active:scale-95 transition-all duration-150 tracking-wider uppercase"
        >
          Mulai Bermain!
        </button>
      </div>
    </div>
  );
}
