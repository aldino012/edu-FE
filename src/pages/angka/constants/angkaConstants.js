// Pola overlay matematika
export const mathPattern = [
  {
    id: 1,
    char: "1",
    top: "10%",
    left: "10%",
    rotate: "-15deg",
    size: "text-5xl",
  },
  {
    id: 2,
    char: "+",
    top: "20%",
    left: "30%",
    rotate: "10deg",
    size: "text-7xl",
  },
  {
    id: 3,
    char: "2",
    top: "15%",
    left: "55%",
    rotate: "-5deg",
    size: "text-6xl",
  },
  {
    id: 4,
    char: "=",
    top: "25%",
    left: "75%",
    rotate: "15deg",
    size: "text-6xl",
  },
  {
    id: 5,
    char: "3",
    top: "12%",
    left: "90%",
    rotate: "5deg",
    size: "text-5xl",
  },
  {
    id: 6,
    char: "x",
    top: "40%",
    left: "20%",
    rotate: "20deg",
    size: "text-6xl",
  },
  {
    id: 7,
    char: "5",
    top: "35%",
    left: "45%",
    rotate: "-10deg",
    size: "text-5xl",
  },
  {
    id: 8,
    char: "÷",
    top: "45%",
    left: "65%",
    rotate: "0deg",
    size: "text-7xl",
  },
  {
    id: 9,
    char: "8",
    top: "38%",
    left: "85%",
    rotate: "-20deg",
    size: "text-6xl",
  },
  {
    id: 10,
    char: "-",
    top: "60%",
    left: "15%",
    rotate: "10deg",
    size: "text-7xl",
  },
  {
    id: 11,
    char: "4",
    top: "55%",
    left: "35%",
    rotate: "-15deg",
    size: "text-6xl",
  },
  {
    id: 12,
    char: "9",
    top: "65%",
    left: "55%",
    rotate: "5deg",
    size: "text-5xl",
  },
  {
    id: 13,
    char: "%",
    top: "50%",
    left: "80%",
    rotate: "15deg",
    size: "text-6xl",
  },
  {
    id: 14,
    char: "7",
    top: "75%",
    left: "25%",
    rotate: "-5deg",
    size: "text-6xl",
  },
  {
    id: 15,
    char: "+",
    top: "70%",
    left: "45%",
    rotate: "20deg",
    size: "text-7xl",
  },
  {
    id: 16,
    char: "6",
    top: "80%",
    left: "70%",
    rotate: "-10deg",
    size: "text-5xl",
  },
];

// Warna permen
export const candyColors = [
  "text-red-500",
  "text-blue-500",
  "text-green-500",
  "text-yellow-500",
  "text-purple-500",
  "text-pink-500",
  "text-orange-500",
  "text-teal-500",
];

// Helper angka → terbilang
export const terbilang = (angka) => {
  const huruf = [
    "Nol",
    "Satu",
    "Dua",
    "Tiga",
    "Empat",
    "Lima",
    "Enam",
    "Tujuh",
    "Delapan",
    "Sembilan",
    "Sepuluh",
    "Sebelas",
  ];

  if (angka < 12) return huruf[angka];
  if (angka < 20) return terbilang(angka - 10) + " Belas";

  if (angka < 100) {
    const puluh = Math.floor(angka / 10);
    const sisa = angka % 10;
    return huruf[puluh] + " Puluh" + (sisa > 0 ? " " + huruf[sisa] : "");
  }

  if (angka === 100) return "Seratus";

  return angka.toString();
};