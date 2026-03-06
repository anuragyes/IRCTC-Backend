/*
  Warnings:

  - Added the required column `passengerCount` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Booking_trainId_travelDate_status_idx";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "passengerCount" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "Booking_trainId_travelDate_classType_quota_idx" ON "Booking"("trainId", "travelDate", "classType", "quota");
