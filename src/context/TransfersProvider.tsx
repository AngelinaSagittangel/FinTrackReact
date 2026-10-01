import { useEffect, useState, type ReactNode } from "react";

import { TransfersContext } from "./TransfersContext";
import type { TransferType } from "../types/TransferType";
import { useAuth } from "../hooks/useAuth";

import {
  createTransferApi,
  deleteTransferApi,
  getTransfersApi,
  updateTransferApi,
} from "../services/transferService";

function TransfersProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  const [transfers, setTransfers] = useState<TransferType[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    getTransfersApi()
      .then((transfersFromApi) => {
        const formattedTransfers = transfersFromApi.map((transfer) => ({
          id: transfer.id,
          userId: transfer.fromWallet.userId,
          fromWalletId: transfer.fromWalletId,
          toWalletId: transfer.toWalletId,
          amount: Number(transfer.amount),
          date: transfer.date,
        }));

        setTransfers(formattedTransfers);
      })
      .catch((error) => {
        console.error("Не удалось загрузить переводы:", error);
      });
  }, [isAuthenticated]);

  async function addTransfer(transfer: TransferType) {
    const createdTransfer = await createTransferApi(
      transfer.amount,
      transfer.date,
      transfer.fromWalletId,
      transfer.toWalletId,
    );

    setTransfers((prevTransfers) => [
      ...prevTransfers,
      {
        id: createdTransfer.id,
        userId: createdTransfer.fromWallet.userId,
        fromWalletId: createdTransfer.fromWalletId,
        toWalletId: createdTransfer.toWalletId,
        amount: Number(createdTransfer.amount),
        date: createdTransfer.date,
      },
    ]);
  }

  async function editTransfer(transfer: TransferType) {
    const updatedTransfer = await updateTransferApi(
      transfer.id,
      transfer.amount,
      transfer.date,
    );

    setTransfers((prevTransfers) =>
      prevTransfers.map((currentTransfer) =>
        currentTransfer.id === transfer.id
          ? {
              id: updatedTransfer.id,
              userId: updatedTransfer.fromWallet.userId,
              fromWalletId: updatedTransfer.fromWalletId,
              toWalletId: updatedTransfer.toWalletId,
              amount: Number(updatedTransfer.amount),
              date: updatedTransfer.date,
            }
          : currentTransfer,
      ),
    );
  }

  async function removeTransfer(id: string) {
    await deleteTransferApi(id);

    setTransfers((prevTransfers) =>
      prevTransfers.filter((transfer) => transfer.id !== id),
    );
  }

  return (
    <TransfersContext.Provider
      value={{
        transfers,
        addTransfer,
        editTransfer,
        removeTransfer,
      }}
    >
      {children}
    </TransfersContext.Provider>
  );
}

export default TransfersProvider;
