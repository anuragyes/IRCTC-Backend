-- CreateTable
CREATE TABLE "SeatAllocation" (
    "id" TEXT NOT NULL,
    "seatId" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "travelDate" TIMESTAMP(3) NOT NULL,
    "fromStopNo" INTEGER NOT NULL,
    "toStopNo" INTEGER NOT NULL,

    CONSTRAINT "SeatAllocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SeatAllocation_seatId_travelDate_idx" ON "SeatAllocation"("seatId", "travelDate");

-- CreateIndex
CREATE INDEX "SeatAllocation_bookingId_idx" ON "SeatAllocation"("bookingId");

-- AddForeignKey
ALTER TABLE "SeatAllocation" ADD CONSTRAINT "SeatAllocation_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "Seat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeatAllocation" ADD CONSTRAINT "SeatAllocation_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
