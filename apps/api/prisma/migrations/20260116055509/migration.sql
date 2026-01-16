/*
  Warnings:

  - You are about to drop the column `isClientNew` on the `bookings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "isClientNew",
ADD COLUMN     "isFirstBooking" BOOLEAN NOT NULL DEFAULT false;
