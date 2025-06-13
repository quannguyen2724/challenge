// --- Interfaces & Types ---
interface WalletBalance {
  blockchain: string;
  currency: string;
  amount: number;
}
// Assuming props for WalletRow and BoxProps to make the code complete
interface WalletRowProps {
  amount: number;
  usdValue: number;
  formattedAmount: string;
}
interface BoxProps {
  children?: React.ReactNode;
}

// Using an object for priority lookup is more efficient and readable than a switch-case
const BLOCKCHAIN_PRIORITIES: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

// Helper function to get priority, with a default value of -99
const getPriority = (blockchain: string): number => {
  return BLOCKCHAIN_PRIORITIES[blockchain] || -99;
};

// --- Component ---

const WalletPage: React.FC<BoxProps> = ({ children, ...rest }) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  // useMemo only recalculates when `balances` changes
  const processedBalances = useMemo(() => {
    return (
      balances
        // 1. Filter for balances with a valid priority and positive amount
        .filter(
          (balance) =>
            getPriority(balance.blockchain) > -99 && balance.amount > 0
        )
        // 2. Sort the valid balances in descending order by priority
        .sort(
          (lhs, rhs) =>
            getPriority(rhs.blockchain) - getPriority(lhs.blockchain)
        )
    );
  }, [balances]);

  // 3. Map directly from the processed array to render (only one iteration)
  const rows = processedBalances.map((balance) => {
    const usdValue = prices[balance.currency] * balance.amount;

    return (
      <WalletRow
        // Use a unique and stable key, not the index
        key={balance.currency}
        amount={balance.amount}
        usdValue={usdValue}
        // Format directly, no intermediate array needed
        formattedAmount={balance.amount.toFixed(2)}
      />
    );
  });

  return <div {...rest}>{rows}</div>;
};

// --- Mocks to make the code runnable for demo purposes ---
const WalletRow: React.FC<WalletRowProps> = ({
  amount,
  usdValue,
  formattedAmount,
}) => (
  <div style={{ borderBottom: "1px solid #ccc", padding: "10px" }}>
    <p>Amount: {amount}</p>
    <p>Formatted: {formattedAmount}</p>
    <p>USD Value: ${usdValue.toFixed(2)}</p>
  </div>
);

export default WalletPage;
