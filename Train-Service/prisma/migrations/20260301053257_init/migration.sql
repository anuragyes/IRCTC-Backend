/*
  Warnings:

  - You are about to drop the `Route` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RouteStop` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Station` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Route" DROP CONSTRAINT "Route_trainId_fkey";

-- DropForeignKey
ALTER TABLE "RouteStop" DROP CONSTRAINT "RouteStop_routeId_fkey";

-- DropForeignKey
ALTER TABLE "RouteStop" DROP CONSTRAINT "RouteStop_stationId_fkey";

-- DropTable
DROP TABLE "Route";

-- DropTable
DROP TABLE "RouteStop";

-- DropTable
DROP TABLE "Station";

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "trainId" TEXT NOT NULL,
    "seatId" TEXT NOT NULL,
    "travelDate" TIMESTAMP(3) NOT NULL,
    "fromStationNo" INTEGER NOT NULL,
    "toStationNo" INTEGER NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Coach" ADD CONSTRAINT "Coach_trainId_fkey" FOREIGN KEY ("trainId") REFERENCES "Train"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "Seat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_trainId_fkey" FOREIGN KEY ("trainId") REFERENCES "Train"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
