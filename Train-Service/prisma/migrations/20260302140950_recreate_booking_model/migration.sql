/*
  Warnings:

  - You are about to drop the column `seatId` on the `Booking` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pnrNumber]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `classType` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pnrNumber` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "BookingStatus" ADD VALUE 'RAC';

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_seatId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_trainId_fkey";

-- DropIndex
DROP INDEX "Booking_seatId_idx";

-- DropIndex
DROP INDEX "Booking_seatId_travelDate_key";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "seatId",
ADD COLUMN     "classType" TEXT NOT NULL,
ADD COLUMN     "pnrNumber" TEXT NOT NULL,
ADD COLUMN     "quota" TEXT NOT NULL DEFAULT 'GENERAL',
ADD COLUMN     "racNumber" INTEGER,
ADD COLUMN     "seatNumber" TEXT,
ADD COLUMN     "wlNumber" INTEGER,
ALTER COLUMN "status" DROP DEFAULT;

-- CreateTable
CREATE TABLE "SeatInventory" (
    "id" TEXT NOT NULL,
    "trainId" TEXT NOT NULL,
    "travelDate" TIMESTAMP(3) NOT NULL,
    "classType" TEXT NOT NULL,
    "quota" TEXT NOT NULL DEFAULT 'GENERAL',
    "segmentNo" INTEGER NOT NULL,
    "availableCount" INTEGER NOT NULL,
    "racAvailable" INTEGER NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SeatInventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeatAllocation" (
    "id" TEXT NOT NULL,
    "trainId" TEXT NOT NULL,
    "travelDate" TIMESTAMP(3) NOT NULL,
    "classType" TEXT NOT NULL,
    "seatNumber" TEXT NOT NULL,
    "segmentNo" INTEGER NOT NULL,
    "bookingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SeatAllocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SeatInventory_trainId_travelDate_idx" ON "SeatInventory"("trainId", "travelDate");

-- CreateIndex
CREATE UNIQUE INDEX "SeatInventory_trainId_travelDate_classType_quota_segmentNo_key" ON "SeatInventory"("trainId", "travelDate", "classType", "quota", "segmentNo");

-- CreateIndex
CREATE INDEX "SeatAllocation_bookingId_idx" ON "SeatAllocation"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "SeatAllocation_trainId_travelDate_seatNumber_segmentNo_key" ON "SeatAllocation"("trainId", "travelDate", "seatNumber", "segmentNo");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_pnrNumber_key" ON "Booking"("pnrNumber");

-- CreateIndex
CREATE INDEX "Booking_trainId_travelDate_status_idx" ON "Booking"("trainId", "travelDate", "status");
