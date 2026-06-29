import { motion, AnimatePresence } from "framer-motion";
import Text from "../../../components/Text";
import Card from "../../../components/Card";
import SyllableButton from "./SyllableButton";

const SyllableGrid = ({
  options = [],
  correctSyllables = [],
  selectedSyllables = [],
  status = "idle",
  onSelect,
  onPlayAudio,
  disabled = false,
}) => {
  if (options.length === 0) {
    return (
      <Card className="w-full p-8 bg-white bg-opacity-90">
        <div className="flex flex-col items-center justify-center gap-4">
          <Text variant="h2" className="text-gray-500">
            Tidak ada opsi suku kata
          </Text>
        </div>
      </Card>
    );
  }

  const getButtonStatus = (syllable) => {
    const selectedIndex = selectedSyllables.indexOf(syllable);
    const isSelected = selectedIndex !== -1;

    const currentSelectionIndex = selectedSyllables.length;
    const isCorrectAtPosition =
      correctSyllables[currentSelectionIndex] === syllable;

    if (status === "correct" && isSelected) return "correct";
    if (status === "wrong" && isSelected && !isCorrectAtPosition)
      return "wrong";
    if (isSelected) return "selected";

    return "idle";
  };

  const isButtonDisabled = (syllable) => {
    if (status === "completed") return true;
    return selectedSyllables.includes(syllable);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <Card className="w-full p-6 sm:p-8 bg-white bg-opacity-90">
      {/* Header */}
      <div className="mb-6 text-center">
        <Text
          variant="h2"
          className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2"
        >
          Pilih Suku Kata
        </Text>
        <Text variant="body" className="text-gray-600 text-sm sm:text-base">
          Klik suku kata dalam urutan yang benar
        </Text>
      </div>

      {/* Grid Suku Kata - LEBIH BESAR */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 sm:gap-5 justify-items-center"
      >
        <AnimatePresence mode="popLayout">
          {options.map((syllable, index) => {
            const buttonStatus = getButtonStatus(syllable);
            const buttonDisabled = isButtonDisabled(syllable);

            return (
              <motion.div
                key={`${syllable}-${index}`}
                variants={itemVariants}
                exit={{ scale: 0, opacity: 0 }}
                layout
              >
                <SyllableButton
                  syllable={syllable}
                  onClick={() => onSelect && onSelect(syllable)}
                  status={buttonStatus}
                  disabled={buttonDisabled || disabled}
                  onPlayAudio={onPlayAudio}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Instruksi */}
      {status === "idle" && selectedSyllables.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 text-center"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-100 rounded-full">
            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" />
            <Text variant="body" className="text-blue-700 text-sm font-medium">
              Mulai dengan memilih suku kata pertama
            </Text>
          </div>
        </motion.div>
      )}

      {status === "playing" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 text-center"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-yellow-100 rounded-full">
            <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full animate-pulse" />
            <Text
              variant="body"
              className="text-yellow-700 text-sm font-medium"
            >
              Lanjutkan memilih suku kata berikutnya
            </Text>
          </div>
        </motion.div>
      )}

      {status === "completed" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-100 rounded-full">
            <Text variant="h3" className="text-green-700 text-lg font-bold">
              🎉 Semua suku kata telah dipilih!
            </Text>
          </div>
        </motion.div>
      )}
    </Card>
  );
};

export default SyllableGrid;
