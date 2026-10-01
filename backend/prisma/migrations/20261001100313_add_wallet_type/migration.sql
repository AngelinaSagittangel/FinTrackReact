/*
  Warnings:

  - Added the required column `type` to the `Wallet` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WalletType" AS ENUM ('cash', 'card', 'savings', 'investment');

-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "type" "WalletType" NOT NULL;
