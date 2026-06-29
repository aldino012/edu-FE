import { motion } from "framer-motion";
import { FaVolumeUp } from "react-icons/fa";
import Text from "../../../components/Text";

const SyllableButton = ({
  syllable,
  onClick,
  status = "idle",
  disabled = false,
  color = "bg-blue-400",
  onPlayAudio,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case "selected":
        return "bg-yellow-400 border-yellow-600";
      case "correct":
        return "bg-green-400 border-green-600";
      case "wrong":
        return "bg-red-400 border-red-600";
      default:
        return `${color} border-white`;
    }
  };

  const getAnimation = () => {
    switch (status) {
      case "correct":
        return { scale: [1, 1.2, 1], transition: { duration: 0.3 } };
      case "wrong":
        return { x: [-10, 10, -10, 10, 0], transition: { duration: 0.4 } };
      default:
        return {};
    }
  };

  const handleClick = () => {
    if (disabled || status === "correct") return;

    if (onPlayAudio) {
      onPlayAudio(syllable);
    }

    if (onClick) {
      onClick(syllable);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled || status === "correct"}
      animate={getAnimation()}
      whileHover={!disabled && status !== "correct" ? { scale: 1.05 } : {}}
      whileTap={!disabled && status !== "correct" ? { scale: 0.95 } : {}}
      className={`
        relative
        w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28
        rounded-2xl
        border-4
        shadow-lg
        flex items-center justify-center
        transition-all duration-200
        ${getStatusColor()}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${status === "correct" ? "cursor-default" : ""}
      `}
    >
      {/* Teks Suku Kata */}
      <Text
        variant="h2"
        className="text-white font-bold text-2xl sm:text-3xl md:text-4xl drop-shadow-md"
      >
        {syllable}
      </Text>

      {/* Icon Speaker - KECILKAN */}
      {onPlayAudio && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2"
        >
          <FaVolumeUp className="text-white text-xs sm:text-sm opacity-70" />
        </motion.div>
      )}

      {/* Overlay saat correct */}
      {status === "correct" && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 bg-green-500 bg-opacity-30 rounded-2xl flex items-center justify-center"
        >
          <Text variant="h1" className="text-white text-5xl sm:text-6xl">
            ✓
          </Text>
        </motion.div>
      )}

      {/* Overlay saat wrong */}
      {status === "wrong" && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 bg-red-500 bg-opacity-30 rounded-2xl flex items-center justify-center"
        >
          <Text variant="h1" className="text-white text-5xl sm:text-6xl">
            ✗
          </Text>
        </motion.div>
      )}
    </motion.button>
  );
};

export default SyllableButton;
