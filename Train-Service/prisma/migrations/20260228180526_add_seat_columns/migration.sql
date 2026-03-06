/*
  Warnings:

  - You are about to drop the column `seatNumber` on the `Seat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Seat" DROP COLUMN "seatNumber",
ADD COLUMN     "seatNo" TEXT,
ADD COLUMN     "trainId" TEXT,
ADD COLUMN     "type" TEXT;
