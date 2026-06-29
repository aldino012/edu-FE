import { motion } from "framer-motion";
import { FaVolumeUp, FaImage } from "react-icons/fa";
import Text from "../../../components/Text";
import Card from "../../../components/Card";
import Button from "../../../components/Button";

const SyllableCard = ({
  currentWord,
  selectedSyllables = [],
  correctSyllables = [],
  status = "idle",
  onPlayAudio,
  currentIndex = 0,
  totalWords = 0,
}) => {
  if (!currentWord) {
    return (
      <Card className="w-full p-8 bg-white bg-opacity-90">
        <div className="flex flex-col items-center justify-center gap-4">
          <FaImage className="text-gray-400 text-6xl" />
          <Text variant="h2" className="text-gray-500">
            Tidak ada data kata
          </Text>
        </div>
      </Card>
    );
  }

  const { letter, word, imageUrl, audioUrl } = currentWord;
  const progress = totalWords > 0 ? ((currentIndex + 1) / totalWords) * 100 : 0;

  const getStatusBorderColor = () => {
    switch (status) {
      case "correct":
        return "border-green-500";
      case "wrong":
        return "border-red-500";
      default:
        return "border-blue-300";
    }
  };

  const getStatusBgColor = () => {
    switch (status) {
      case "correct":
        return "bg-green-50";
      case "wrong":
        return "bg-red-50";
      default:
        return "bg-white";
    }
  };

  return (
    <Card
      className={`
        w-full p-6 sm:p-8 
        ${getStatusBgColor()} 
        border-4 ${getStatusBorderColor()}
        transition-all duration-300
      `}
    >
      {/* Header: Progress dan Info - DIPISAHKAN dengan flex */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        {/* Badge Huruf dan Progress */}
        <div className="flex items-center gap-4 flex-1">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-500 flex items-center justify-center shadow-lg flex-shrink-0"
          >
            <Text
              variant="h1"
              className="text-white text-2xl sm:text-3xl font-bold"
            >
              {letter}
            </Text>
          </motion.div>

          <div className="flex-1">
            <Text variant="body" className="text-gray-600 text-sm font-medium">
              Kata ke-{currentIndex + 1} dari {totalWords}
            </Text>
            <div className="w-full h-3 bg-gray-200 rounded-full mt-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-blue-500 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Tombol Audio - DIPISAHKAN */}
        {audioUrl && (
          <Button
            variant="secondary"
            onClick={() => onPlayAudio && onPlayAudio(audioUrl)}
            className="flex items-center gap-2 px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold"
          >
            <FaVolumeUp className="text-lg" />
            <Text variant="body" className="font-bold">
              DENGAR
            </Text>
          </Button>
        )}
      </div>

      {/* Gambar Kata - LEBIH BESAR */}
      <div className="flex justify-center mb-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={word}
              className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 object-contain drop-shadow-lg"
            />
          ) : (
            <div className="w-40 h-40 sm:w-48 sm:h-48 bg-gray-200 rounded-2xl flex items-center justify-center">
              <FaImage className="text-gray-400 text-5xl" />
            </div>
          )}

          {/* Badge status */}
          {status === "correct" && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="absolute -top-2 -right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <Text variant="h2" className="text-white text-3xl">
                ✓
              </Text>
            </motion.div>
          )}

          {status === "wrong" && (
            <motion.div
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="absolute -top-2 -right-2 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <Text variant="h2" className="text-white text-3xl">
                ✗
              </Text>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Teks Kata */}
      <div className="text-center mb-6">
        <Text
          variant="h1"
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 mb-2"
        >
          {word}
        </Text>
        <Text variant="body" className="text-gray-500 text-sm sm:text-base">
          Susun suku kata di bawah ini
        </Text>
      </div>

      {/* Area Suku Kata yang Dipilih - LEBIH BESAR */}
      <div className="bg-gray-100 rounded-2xl p-6 sm:p-8">
        <Text
          variant="body"
          className="text-gray-600 text-sm mb-4 text-center font-medium"
        >
          Suku kata yang kamu pilih:
        </Text>

        <div className="flex flex-wrap justify-center gap-4 min-h-[100px] items-center">
          {correctSyllables.map((correctSyllable, index) => {
            const selectedSyllable = selectedSyllables[index];
            const isFilled = selectedSyllable !== undefined;
            const isCorrect = isFilled && selectedSyllable === correctSyllable;
            const isWrong = isFilled && selectedSyllable !== correctSyllable;

            return (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  w-24 h-24 sm:w-28 sm:h-28
                  rounded-xl
                  border-4 border-dashed
                  flex items-center justify-center
                  transition-all duration-300
                  ${
                    isCorrect
                      ? "bg-green-400 border-green-600 border-solid"
                      : isWrong
                        ? "bg-red-400 border-red-600 border-solid"
                        : "bg-white border-gray-300"
                  }
                `}
              >
                {isFilled ? (
                  <Text
                    variant="h2"
                    className="text-white text-3xl sm:text-4xl font-bold"
                  >
                    {selectedSyllable}
                  </Text>
                ) : (
                  <Text
                    variant="h2"
                    className="text-gray-300 text-3xl sm:text-4xl"
                  >
                    ?
                  </Text>
                )}
              </motion.div>
            );
          })}

          {correctSyllables.length === 0 && (
            <Text variant="body" className="text-gray-400">
              Belum ada suku kata
            </Text>
          )}
        </div>
      </div>

      {/* Feedback Message */}
      {status === "correct" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-center"
        >
          <Text
            variant="h2"
            className="text-green-600 text-2xl sm:text-3xl font-bold"
          >
            🎉 Hebat! Benar sekali!
          </Text>
        </motion.div>
      )}

      {status === "wrong" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-center"
        >
          <Text
            variant="h2"
            className="text-red-600 text-2xl sm:text-3xl font-bold"
          >
            💪 Coba lagi ya!
          </Text>
        </motion.div>
      )}
    </Card>
  );
};

export default SyllableCard;
