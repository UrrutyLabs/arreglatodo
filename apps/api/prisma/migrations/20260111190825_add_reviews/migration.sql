/*
  Warnings:

  - Added the required column `clientUserId` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `proProfileId` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "clientUserId" TEXT NOT NULL,
ADD COLUMN     "proProfileId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "reviews_proProfileId_idx" ON "reviews"("proProfileId");

-- CreateIndex
CREATE INDEX "reviews_clientUserId_idx" ON "reviews"("clientUserId");

-- CreateIndex
CREATE INDEX "reviews_bookingId_idx" ON "reviews"("bookingId");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_proProfileId_fkey" FOREIGN KEY ("proProfileId") REFERENCES "pro_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_clientUserId_fkey" FOREIGN KEY ("clientUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
