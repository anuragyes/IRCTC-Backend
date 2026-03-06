/*
  Warnings:

  - You are about to drop the column `passengerAge` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `passengerName` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `trainId` on the `RouteStop` table. All the data in the column will be lost.
  - The `arrivalTime` column on the `RouteStop` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `departureTime` column on the `RouteStop` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[routeId,stopNumber]` on the table `RouteStop` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `routeId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `routeId` to the `RouteStop` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RouteStop" DROP CONSTRAINT "RouteStop_trainId_fkey";

-- DropIndex
DROP INDEX "RouteStop_trainId_stopNumber_key";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "passengerAge",
DROP COLUMN "passengerName",
ADD COLUMN     "routeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RouteStop" DROP COLUMN "trainId",
ADD COLUMN     "distanceFromSource" INTEGER,
ADD COLUMN     "routeId" TEXT NOT NULL,
DROP COLUMN "arrivalTime",
ADD COLUMN     "arrivalTime" TIMESTAMP(3),
DROP COLUMN "departureTime",
ADD COLUMN     "departureTime" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Route" (
    "id" TEXT NOT NULL,
    "trainId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "effectiveFrom" TIMESTAMP(3),
    "effectiveTo" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Route_trainId_version_key" ON "Route"("trainId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "RouteStop_routeId_stopNumber_key" ON "RouteStop"("routeId", "stopNumber");

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_trainId_fkey" FOREIGN KEY ("trainId") REFERENCES "Train"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteStop" ADD CONSTRAINT "RouteStop_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
