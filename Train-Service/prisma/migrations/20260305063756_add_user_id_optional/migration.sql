/*
  Warnings:

  - Added the required column `userId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Booking_trainId_travelDate_classType_quota_idx";

-- DropIndex
DROP INDEX "Booking_trainId_travelDate_idx";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "userId" TEXT NOT NULL;
