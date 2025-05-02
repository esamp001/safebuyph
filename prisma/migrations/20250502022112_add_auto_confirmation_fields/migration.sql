-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "autoConfirmationDeadline" TIMESTAMP(3),
ADD COLUMN     "autoReleased" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "receivedAt" TIMESTAMP(3);
