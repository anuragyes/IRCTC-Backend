/*
  Warnings:

  - You are about to drop the column `fromStationNo` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `toStationNo` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `trainId` on the `Seat` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Seat` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[trainId,coachName]` on the table `Coach` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[coachId,seatNo]` on the table `Seat` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fromStopNo` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passengerAge` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passengerName` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toStopNo` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Coach` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Train` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Seat" DROP CONSTRAINT "Seat_trainId_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "fromStationNo",
DROP COLUMN "toStationNo",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fromStopNo" INTEGER NOT NULL,
ADD COLUMN     "passengerAge" INTEGER NOT NULL,
ADD COLUMN     "passengerName" TEXT NOT NULL,
ADD COLUMN     "toStopNo" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Coach" ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Seat" DROP COLUMN "trainId",
DROP COLUMN "type",
ADD COLUMN     "berthType" TEXT;

-- AlterTable
ALTER TABLE "Train" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Station" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Station_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RouteStop" (
    "id" TEXT NOT NULL,
    "trainId" TEXT NOT NULL,
    "stationId" TEXT NOT NULL,
    "stopNumber" INTEGER NOT NULL,
    "arrivalTime" TEXT,
    "departureTime" TEXT,

    CONSTRAINT "RouteStop_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Station_code_key" ON "Station"("code");

-- CreateIndex
CREATE UNIQUE INDEX "RouteStop_trainId_stopNumber_key" ON "RouteStop"("trainId", "stopNumber");

-- CreateIndex
CREATE INDEX "Booking_trainId_travelDate_idx" ON "Booking"("trainId", "travelDate");

-- CreateIndex
CREATE UNIQUE INDEX "Coach_trainId_coachName_key" ON "Coach"("trainId", "coachName");

-- CreateIndex
CREATE UNIQUE INDEX "Seat_coachId_seatNo_key" ON "Seat"("coachId", "seatNo");

-- AddForeignKey
ALTER TABLE "RouteStop" ADD CONSTRAINT "RouteStop_trainId_fkey" FOREIGN KEY ("trainId") REFERENCES "Train"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteStop" ADD CONSTRAINT "RouteStop_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
