/*
  Warnings:

  - Made the column `seatNo` on table `Seat` required. This step will fail if there are existing NULL values in that column.
  - Made the column `trainId` on table `Seat` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Seat" ALTER COLUMN "seatNo" SET NOT NULL,
ALTER COLUMN "trainId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_trainId_fkey" FOREIGN KEY ("trainId") REFERENCES "Train"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
