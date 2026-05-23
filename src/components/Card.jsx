const Card = ({ children, className = "", onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-[#cde6f7] /* Warna biru muda mendekati gambar */
        rounded-[2.5rem] /* Sudut yang sangat melengkung */
        shadow-[0_10px_20px_rgba(0,0,0,0.3)] /* Shadow tebal ke bawah */
        p-8 
        min-w-[200px]
        flex flex-col items-center justify-center gap-4
        transition-all duration-300 ease-out
        hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(0,0,0,0.4)]
        cursor-pointer
        ${className} /* Mengizinkan penambahan class kustom dari luar */
      `}
    >
      {children}
    </div>
  );
};

export default Card;
