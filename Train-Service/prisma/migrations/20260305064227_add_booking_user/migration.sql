/*
  Warnings:

  - You are about to drop the column `userId` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `userID` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "userId",
ADD COLUMN     "userID" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Booking_trainId_travelDate_idx" ON "Booking"("trainId", "travelDate");

-- CreateIndex
CREATE INDEX "Booking_trainId_travelDate_classType_quota_idx" ON "Booking"("trainId", "travelDate", "classType", "quota");
