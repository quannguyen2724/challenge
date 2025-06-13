import { AnimatePresence, motion } from "framer-motion";
import React from "react";

interface CurrencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCurrency: (currency: string) => void;
  tokenSymbols: string[];
}

const CurrencyModal = ({
  isOpen,
  onClose,
  onSelectCurrency,
  tokenSymbols,
}: CurrencyModalProps) => {
  const [errorIcons, setErrorIcons] = React.useState<Record<string, boolean>>(
    {}
  );

  const handleImgError = (symbol: string) => {
    setErrorIcons((prev) => ({ ...prev, [symbol]: true }));
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4"
          onClick={onClose}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 p-5 sm:p-6 rounded-2xl w-full max-w-sm max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
            variants={modalVariants}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Select a Token</h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-white"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto -mr-2 pr-2">
              {tokenSymbols.map((symbol: string) => (
                <motion.div
                  key={symbol}
                  className="flex items-center p-3 cursor-pointer rounded-lg transition-colors hover:bg-gray-800/60"
                  onClick={() => onSelectCurrency(symbol)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {errorIcons[symbol] ? (
                    <div className="w-8 h-8 mr-4 rounded-full bg-gray-700 animate-pulse" />
                  ) : (
                    <img
                      src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${symbol}.svg`}
                      alt={symbol}
                      className="w-8 h-8 mr-4"
                      onError={() => handleImgError(symbol)}
                    />
                  )}
                  <div className="flex flex-col">
                    <span className="font-semibold text-white">{symbol}</span>
                    <span className="text-sm text-gray-400">{symbol}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CurrencyModal;
