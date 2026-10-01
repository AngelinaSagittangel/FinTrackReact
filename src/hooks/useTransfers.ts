import { useContext } from "react";
import { TransfersContext } from "../context/TransfersContext";

function useTransfers() {
  const context = useContext(TransfersContext);

  if (!context) {
    throw new Error(
      "useTransfers должен использоваться внутри TransfersProvider",
    );
  }

  return context;
}

export default useTransfers;
