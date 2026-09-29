import { useContext } from "react";
import { BudgetsContext } from "../context/BudgetsContext";

function useBudgets() {
  const context = useContext(BudgetsContext);

  if (context === null) {
    throw new Error(
      "useBudgets must be used within BudgetsProvider",
    );
  }

  return context;
}

export default useBudgets;