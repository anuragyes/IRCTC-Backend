-- CreateTable
CREATE TABLE "BookingCounter" (
    "id" TEXT NOT NULL,
    "trainId" TEXT NOT NULL,
    "travelDate" TIMESTAMP(3) NOT NULL,
    "classType" TEXT NOT NULL,
    "quota" TEXT NOT NULL,
    "racCounter" INTEGER NOT NULL DEFAULT 0,
    "wlCounter" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "BookingCounter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BookingCounter_trainId_travelDate_classType_quota_key" ON "BookingCounter"("trainId", "travelDate", "classType", "quota");
