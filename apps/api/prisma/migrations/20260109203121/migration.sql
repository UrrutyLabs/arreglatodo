/*
  Warnings:

  - Added the required column `category` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `pro_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('plumbing', 'electrical', 'cleaning', 'handyman', 'painting');

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "category" "Category" NOT NULL;

-- AlterTable
ALTER TABLE "pro_profiles" ADD COLUMN     "categories" "Category"[],
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "serviceArea" TEXT;

-- CreateIndex
CREATE INDEX "bookings_category_idx" ON "bookings"("category");
