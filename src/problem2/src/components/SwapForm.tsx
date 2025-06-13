import { motion } from "framer-motion";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { useSwapLogic } from "../hooks/useSwapLogic";
import CurrencyInput from "./CurrencyInput";
import CurrencyModal from "./CurrencyModal";

type ModalType = "from" | "to" | null;

const SwapForm = () => {
  const [modalOpen, setModalOpen] = useState<ModalType>(null);
  const { form, state, handlers } = useSwapLogic();

  const { control, handleSubmit, errors: formErrors } = form;

  const {
    fromToken,
    toToken,
    calculatedAmountTo,
    isSubmitting,
    isSwapDisabled,
    tokenSymbols,
  } = state;

  const { handleSwapTokens, handleSelectToken } = handlers;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 p-8 rounded-2xl shadow-lg w-full max-w-md"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-white">
        Currency Swap
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="relative space-y-4">
          <Controller
            name="amountFrom"
            control={control}
            render={({ field }) => (
              <CurrencyInput
                label="You send"
                amount={field.value?.toString() || ""}
                onAmountChange={(e) => field.onChange(Number(e.target.value))}
                selectedCurrency={fromToken || ""}
                setIsCurrencyModalOpen={() => setModalOpen("from")}
              />
            )}
          />
          <div className="absolute w-full flex justify-center top-1/2 -translate-y-1/2 z-10">
            <motion.button
              type="button"
              className="w-11 h-11 rounded-full bg-white border-4 border-gray-100 flex items-center justify-center cursor-pointer text-indigo-600"
              onClick={handleSwapTokens}
              whileHover={{ rotate: 180, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
              </svg>
            </motion.button>
          </div>
          <CurrencyInput
            label="You receive"
            amount={calculatedAmountTo}
            onAmountChange={() => {}}
            selectedCurrency={toToken || ""}
            setIsCurrencyModalOpen={() => setModalOpen("to")}
          />
        </div>
        {formErrors.amountFrom && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm mt-2 text-center"
          >
            {formErrors.amountFrom?.message}
          </motion.div>
        )}
        <motion.button
          type="submit"
          className="w-full mt-6 py-4 text-lg font-bold rounded-xl border-none cursor-pointer bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white transition-all hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] disabled:opacity-50 disabled:cursor-default disabled:shadow-none flex items-center justify-center gap-2"
          disabled={isSwapDisabled}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitting ? (
            <div className="w-6 h-6 border-2 border-white border-b-transparent rounded-full inline-block animate-spin"></div>
          ) : (
            "Swap"
          )}
        </motion.button>
      </form>
      <CurrencyModal
        isOpen={modalOpen === "from"}
        onClose={() => setModalOpen(null)}
        onSelectCurrency={(symbol) => {
          handleSelectToken("from", symbol);
          setModalOpen(null);
        }}
        tokenSymbols={tokenSymbols.filter((s) => s !== toToken)}
      />
      <CurrencyModal
        isOpen={modalOpen === "to"}
        onClose={() => setModalOpen(null)}
        onSelectCurrency={(symbol) => {
          handleSelectToken("to", symbol);
          setModalOpen(null);
        }}
        tokenSymbols={tokenSymbols.filter((s) => s !== fromToken)}
      />
    </motion.div>
  );
};

export default SwapForm;
