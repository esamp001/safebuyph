-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "adminNote" TEXT,
ADD COLUMN     "disputeResolved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "disputedAt" TIMESTAMP(3);
