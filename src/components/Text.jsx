import React from "react";

// ==========================================
// 1. WADAH TEKS (DICTIONARY)
// ==========================================
export const APP_TEXTS = {
  // --- Homepage / Game Menu ---
  title_main: "MARI BELAJAR BERSAMA",
  card_huruf: "MENGENAL\nHURUF",
  card_angka: "MENGENAL\nANGKA",
  card_warna: "MENGENAL\nWARNA",
  card_quiz: "MAIN\nKUIS",

  // --- Admin Panel Specific ---
  admin_sidebar_title: "ADMIN PANEL",
  admin_menu_angka: "Manajemen Angka",
  admin_menu_huruf: "Manajemen Huruf",
  admin_menu_warna: "Manajemen Warna",
  admin_menu_quiz: "Manajemen Kuis",
  admin_welcome: "Selamat Datang di Panel Kontrol",

  // --- Admin Login ---
  admin_login_subtitle: "Panel Kontrol Manajemen Konten",
  admin_login_token_label: "Access Token",
  admin_login_btn: "LOGIN",
  admin_login_footer: "Sesi Admin: 60 Menit",

  // --- Admin CRUD General & Huruf ---
  admin_huruf_title: "Data Master Huruf",
  admin_huruf_add: "Tambah Huruf Baru",
  admin_huruf_edit: "Edit Data Huruf",

  table_no: "No",
  table_huruf: "Huruf",
  table_gambar: "Gambar",
  table_audio: "Audio",
  table_aksi: "Aksi",

  msg_empty_data: "Belum ada data tersedia.",
  msg_delete_confirm: "Apakah Anda yakin ingin menghapus data ini?",

  // --- Quiz & Game Flow ---
  quiz_title: "AYO TEBAK!",
  quiz_score: "Skor Kamu",
  quiz_next: "Lanjut",
  quiz_finish: "Selesai",
  quiz_retry: "Main Lagi",

  // --- Form & Label ---
  label_huruf: "Karakter Huruf",
  label_kategori: "Nama Kategori",
  label_upload_img: "Upload Gambar",
  label_upload_aud: "Upload Audio",

  // --- Buttons ---
  btn_tambah: "Tambah Data",
  btn_simpan: "Simpan Data",
  btn_batal: "Batal",
  btn_kembali: "Kembali",
  btn_keluar: "Keluar",
  btn_main: "Mulai Bermain",
  btn_edit: "Edit",
  btn_hapus: "Hapus",

  // --- Feedback / Status ---
  loading: "Memuat data...",
  error_fetch: "Gagal mengambil data dari server",

  // ==========================================
  // DATA SINKRONISASI (DARI API)
  // ==========================================
  
  // --- DATA ANGKA (value & label) ---
  sync_angka_0: "Nol",
  sync_angka_1: "Satu",
  sync_angka_2: "Dua",
  sync_angka_3: "Tiga",
  sync_angka_4: "Empat",
  sync_angka_5: "Lima",
  sync_angka_6: "Enam",
  sync_angka_7: "Tujuh",
  sync_angka_8: "Delapan",
  sync_angka_9: "Sembilan",

  // --- DATA HURUF (value & label) ---
  sync_huruf_A: "Ayam",
  sync_huruf_B: "Babi",
  sync_huruf_C: "Cicak",
  sync_huruf_D: "Domba",
  sync_huruf_E: "Elang",
  sync_huruf_F: "Flaminggo",
  sync_huruf_G: "Gajah",
  sync_huruf_H: "Harimau",
  sync_huruf_I: "Itik",
  sync_huruf_J: "Jerapah",
  sync_huruf_K: "Kucing",
  sync_huruf_L: "Lebah",
  sync_huruf_M: "Monyet",
  sync_huruf_N: "Naga",
  sync_huruf_O: "Orang Utan",
  sync_huruf_P: "Pinguin",
  sync_huruf_Q: "Quran",
  sync_huruf_R: "Rubah",
  sync_huruf_S: "Sapi",
  sync_huruf_T: "T-Rex",
  sync_huruf_U: "Ular",
  sync_huruf_V: "Violin",
  sync_huruf_W: "Wortel",
  sync_huruf_X: "Xesophone",
  sync_huruf_Y: "Yuyu",
  sync_huruf_Z: "Zebrah",

  // --- DATA WARNA (value & label) ---
  sync_warna_merah: "Merah",
  sync_warna_biru: "Biru",
  sync_warna_kuning: "Kuning",
  sync_warna_hijau: "Hijau",
  sync_warna_hitam: "Hitam",
  sync_warna_putih: "Putih",
  sync_warna_coklat: "Coklat",
  sync_warna_ungu: "Ungu",
  sync_warna_oranye: "Oranye",
  sync_warna_merah_muda: "Merah Muda",

  // --- Informasi Sinkronisasi ---
  sync_info_title: "Informasi Sinkronisasi Data",
  sync_info_description: "Data berikut akan disinkronkan dari server ke aplikasi",
  sync_total_data: "Total Data Tersedia",
  sync_category_angka: "Angka",
  sync_category_huruf: "Huruf",
  sync_category_warna: "Warna",
};

// ==========================================
// 2. KOMPONEN TEXT UTAMA
// ==========================================
const Text = ({
  textKey,
  children,
  variant = "body",
  align = "left",
  as,
  className = "",
  ...props
}) => {
  let content = APP_TEXTS[textKey];

  // Jika tidak ditemukan, coba cari dengan format sync_ (untuk data dinamis)
  if (!content && textKey && textKey.startsWith("sync_")) {
    content = APP_TEXTS[textKey] || textKey;
  }

  if (!content) {
    content = children || textKey;
  }

  const formatContent = (text) => {
    if (typeof text !== "string") return text;
    return text.split("\n").map((item, index) => (
      <React.Fragment key={index}>
        {item}
        {index !== text.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const variants = {
    title:
      "text-3xl md:text-5xl font-black tracking-widest uppercase drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)]",
    subtitle: "text-xl md:text-2xl font-bold tracking-wide drop-shadow-sm",
    body: "text-base md:text-lg font-medium leading-relaxed",
    label: "text-sm font-bold tracking-wider uppercase opacity-80",
    alphabet:
      "text-6xl md:text-8xl font-black drop-shadow-[0_6px_0_rgba(0,0,0,0.2)] hover:scale-110 transition-transform cursor-pointer",
    admin_nav:
      "text-sm font-semibold tracking-wide hover:text-blue-500 transition-colors",
    caption: "text-[10px] font-bold uppercase tracking-wider opacity-60",
    table_head: "text-xs font-bold text-slate-500 uppercase tracking-wider",
    info: "text-sm font-medium leading-relaxed",
    info_title: "text-lg md:text-xl font-bold tracking-wide",
  };

  const alignments = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  let Component = as;
  if (!Component) {
    if (variant === "title") Component = "h1";
    else if (variant === "subtitle") Component = "h2";
    else if (variant === "alphabet") Component = "span";
    else if (variant === "label" || variant === "table_head")
      Component = "label";
    else if (variant === "info_title") Component = "h3";
    else Component = "p";
  }

  return (
    <Component
      className={`${variants[variant] || variants.body} ${alignments[align] || alignments.left} ${className}`}
      {...props}
    >
      {formatContent(content)}
    </Component>
  );
};

export default Text;