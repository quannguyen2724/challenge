import React from "react";

interface CurrencyInputProps {
  label: string;
  amount: string;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedCurrency: string;
  setIsCurrencyModalOpen: (isOpen: boolean) => void;
}

const CurrencyInput = ({
  label,
  amount,
  onAmountChange,
  selectedCurrency,
  setIsCurrencyModalOpen,
}: CurrencyInputProps) => {
  const [iconError, setIconError] = React.useState(false);

  return (
    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 transition-all focus-within:border-indigo-500/80 focus-within:shadow-[0_0_15px_rgba(124,58,237,0.3)]">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm text-gray-400 font-medium">{label}</label>
      </div>
      <div className="flex items-center">
        <input
          type="number"
          value={amount}
          onChange={onAmountChange}
          placeholder="0.0"
          className="w-full bg-transparent text-3xl sm:text-4xl font-bold text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          type="button"
          className="flex items-center bg-gray-900/80 border border-gray-700/50 rounded-full py-2 px-3 sm:px-4 cursor-pointer font-semibold text-base transition-colors hover:bg-gray-800 flex-shrink-0"
          onClick={() => setIsCurrencyModalOpen(true)}
        >
          {iconError ? (
            <div className="w-6 h-6 mr-2 rounded-full bg-gray-700 animate-pulse" />
          ) : (
            <img
              src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${selectedCurrency}.svg`}
              alt={selectedCurrency}
              className="w-6 h-6 mr-2"
              onError={() => setIconError(true)}
            />
          )}
          <span className="text-white">{selectedCurrency}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-1 text-gray-400"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
};
export default CurrencyInput;
