-- CreateTable
CREATE TABLE "Transfer" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fromWalletId" TEXT NOT NULL,
    "toWalletId" TEXT NOT NULL,

    CONSTRAINT "Transfer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_fromWalletId_fkey" FOREIGN KEY ("fromWalletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_toWalletId_fkey" FOREIGN KEY ("toWalletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
