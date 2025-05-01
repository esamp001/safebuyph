/*
  Warnings:

  - You are about to drop the column `idVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "idVerified",
DROP COLUMN "role",
ADD COLUMN     "canSell" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "validIdNumber" TEXT,
ADD COLUMN     "validIdUrl" TEXT;
