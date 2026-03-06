/*
  Warnings:

  - You are about to drop the column `arrivalTime` on the `Train` table. All the data in the column will be lost.
  - You are about to drop the column `departureTime` on the `Train` table. All the data in the column will be lost.
  - You are about to drop the column `destination` on the `Train` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `Train` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Train" DROP COLUMN "arrivalTime",
DROP COLUMN "departureTime",
DROP COLUMN "destination",
DROP COLUMN "source",
ADD COLUMN     "type" TEXT;

-- CreateTable
CREATE TABLE "Station" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Station_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Route" (
    "id" TEXT NOT NULL,
    "trainId" TEXT NOT NULL,
    "totalDistance" INTEGER,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RouteStop" (
    "id" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "stationId" TEXT NOT NULL,
    "stopNumber" INTEGER NOT NULL,
    "arrivalTime" TIMESTAMP(3),
    "departureTime" TIMESTAMP(3),
    "distanceFromSource" INTEGER,
    "isStop" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "RouteStop_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Station_code_key" ON "Station"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Route_trainId_key" ON "Route"("trainId");

-- CreateIndex
CREATE UNIQUE INDEX "RouteStop_routeId_stopNumber_key" ON "RouteStop"("routeId", "stopNumber");

-- CreateIndex
CREATE UNIQUE INDEX "RouteStop_routeId_stationId_key" ON "RouteStop"("routeId", "stationId");

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_trainId_fkey" FOREIGN KEY ("trainId") REFERENCES "Train"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteStop" ADD CONSTRAINT "RouteStop_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteStop" ADD CONSTRAINT "RouteStop_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
