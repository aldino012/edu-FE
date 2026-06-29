import { motion } from "framer-motion";
import { FaSun, FaCloud } from "react-icons/fa";
import ReadingGame from "./components/ReadingGame";

const Partgame = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-sky-400 via-sky-300 to-sky-200">
      {/* --- BACKGROUND DECORATIONS --- */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Matahari */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute top-8 left-1/2 -translate-x-1/2"
        >
          <FaSun className="text-yellow-300 text-7xl sm:text-8xl md:text-9xl drop-shadow-[0_0_20px_rgba(253,224,71,0.9)]" />
        </motion.div>

        {/* Awan Kiri */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="absolute top-16 left-8 sm:left-16 md:left-24"
        >
          <FaCloud className="text-white text-6xl sm:text-7xl md:text-8xl drop-shadow-lg opacity-90" />
        </motion.div>

        {/* Awan Kanan */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="absolute top-20 right-8 sm:right-16 md:right-24"
        >
          <FaCloud className="text-white text-5xl sm:text-6xl md:text-7xl drop-shadow-lg opacity-80" />
        </motion.div>

        {/* Rumput / Tanah di bagian bawah */}
        <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-28 md:h-36 bg-gradient-to-t from-green-600 to-green-400 rounded-t-[50%_100%_0_0/30px] shadow-[0_-5px_20px_rgba(0,0,0,0.15)]" />
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="relative z-10 min-h-screen flex flex-col py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">
          <ReadingGame />
        </div>

        {/* Footer */}
        <div className="relative z-20 pb-4 text-center mt-auto">
          <p className="text-green-900 text-opacity-70 text-xs sm:text-sm font-medium">
            © Edukasi Anak - Ayo Membaca
          </p>
        </div>
      </div>
    </div>
  );
};

export default Partgame;
