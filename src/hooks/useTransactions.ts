import { useContext } from "react";
import { TransactionsContext } from "../context/TransactionsContext";

function useTransactions() {
  const context = useContext(TransactionsContext);

  if (context === null) {
    throw new Error("useTransactions must be used within TransactionsProvider");
  }

  return context;
}

export default useTransactions;
