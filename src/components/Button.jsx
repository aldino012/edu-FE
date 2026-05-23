import React from "react";

const Button = ({
  children,
  onClick,
  className = "",
  variant = "primary",
  size = "md",
  disabled = false,
  ...props
}) => {
  // 1. Konfigurasi Ukuran (Size)
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-xl",
  };

  // 2. Konfigurasi Warna (Variant) dengan Efek 3D Game
  // Menggunakan border-b (border bottom) yang lebih gelap untuk memberikan kesan tombol tebal
  const variants = {
    primary: "bg-blue-400 text-white border-blue-600 hover:bg-blue-300",
    secondary:
      "bg-yellow-400 text-slate-800 border-yellow-600 hover:bg-yellow-300",
    success: "bg-green-400 text-white border-green-600 hover:bg-green-300",
    danger: "bg-red-400 text-white border-red-600 hover:bg-red-300",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative inline-flex items-center justify-center
        font-black tracking-widest uppercase rounded-full
        border-b-[6px] active:border-b-0 active:translate-y-[6px] /* Efek ditekan */
        transition-all duration-150 ease-in-out
        select-none
        ${sizes[size] || sizes.md}
        ${variants[variant] || variants.primary}
        ${disabled ? "opacity-50 cursor-not-allowed active:border-b-[6px] active:translate-y-0" : "cursor-pointer"}
        ${className}
      `}
      {...props}
    >
      {/* Tambahan drop shadow tipis pada teks agar lebih terbaca (opsional) */}
      <span className="drop-shadow-md">{children}</span>
    </button>
  );
};

export default Button;
