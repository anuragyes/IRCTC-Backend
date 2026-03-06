/*
  Warnings:

  - You are about to drop the column `routeId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `routeId` on the `RouteStop` table. All the data in the column will be lost.
  - You are about to drop the `Route` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[trainId,stopNumber]` on the table `RouteStop` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `trainId` to the `RouteStop` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_routeId_fkey";

-- DropForeignKey
ALTER TABLE "Route" DROP CONSTRAINT "Route_trainId_fkey";

-- DropForeignKey
ALTER TABLE "RouteStop" DROP CONSTRAINT "RouteStop_routeId_fkey";

-- DropIndex
DROP INDEX "Booking_routeId_idx";

-- DropIndex
DROP INDEX "RouteStop_routeId_stopNumber_key";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "routeId";

-- AlterTable
ALTER TABLE "RouteStop" DROP COLUMN "routeId",
ADD COLUMN     "trainId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Route";

-- CreateIndex
CREATE UNIQUE INDEX "RouteStop_trainId_stopNumber_key" ON "RouteStop"("trainId", "stopNumber");

-- AddForeignKey
ALTER TABLE "RouteStop" ADD CONSTRAINT "RouteStop_trainId_fkey" FOREIGN KEY ("trainId") REFERENCES "Train"("id") ON DELETE CASCADE ON UPDATE CASCADE;
