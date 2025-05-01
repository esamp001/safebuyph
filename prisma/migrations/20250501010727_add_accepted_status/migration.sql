-- AlterEnum
ALTER TYPE "TransactionStatus" ADD VALUE 'ACCEPTED';

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "deliveryConfirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "deliveryConfirmedAt" TIMESTAMP(3),
ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "shippedAt" TIMESTAMP(3),
ADD COLUMN     "shippingDeadline" TIMESTAMP(3),
ADD COLUMN     "shippingProof" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "rating" SET DEFAULT 3.0;
