-- CreateEnum
CREATE TYPE "PayoutMethod" AS ENUM ('BANK_TRANSFER');

-- CreateEnum
CREATE TYPE "EarningStatus" AS ENUM ('PENDING', 'PAYABLE', 'PAID', 'REVERSED');

-- CreateEnum
CREATE TYPE "PayoutProvider" AS ENUM ('MERCADO_PAGO', 'BANK_TRANSFER', 'MANUAL');

-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('CREATED', 'SENT', 'FAILED', 'SETTLED');

-- CreateTable
CREATE TABLE "pro_payout_profiles" (
    "id" TEXT NOT NULL,
    "proProfileId" TEXT NOT NULL,
    "payoutMethod" "PayoutMethod" NOT NULL DEFAULT 'BANK_TRANSFER',
    "fullName" TEXT,
    "documentId" TEXT,
    "bankName" TEXT,
    "bankAccountType" TEXT,
    "bankAccountNumber" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'UYU',
    "isComplete" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pro_payout_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "earnings" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "proProfileId" TEXT NOT NULL,
    "clientUserId" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "grossAmount" INTEGER NOT NULL,
    "platformFeeAmount" INTEGER NOT NULL,
    "netAmount" INTEGER NOT NULL,
    "status" "EarningStatus" NOT NULL DEFAULT 'PENDING',
    "availableAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "earnings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payouts" (
    "id" TEXT NOT NULL,
    "proProfileId" TEXT NOT NULL,
    "provider" "PayoutProvider" NOT NULL,
    "status" "PayoutStatus" NOT NULL DEFAULT 'CREATED',
    "currency" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "providerReference" TEXT,
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sentAt" TIMESTAMP(3),
    "settledAt" TIMESTAMP(3),

    CONSTRAINT "payouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payout_items" (
    "id" TEXT NOT NULL,
    "payoutId" TEXT NOT NULL,
    "earningId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payout_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pro_payout_profiles_proProfileId_key" ON "pro_payout_profiles"("proProfileId");

-- CreateIndex
CREATE INDEX "pro_payout_profiles_proProfileId_idx" ON "pro_payout_profiles"("proProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "earnings_bookingId_key" ON "earnings"("bookingId");

-- CreateIndex
CREATE INDEX "earnings_proProfileId_idx" ON "earnings"("proProfileId");

-- CreateIndex
CREATE INDEX "earnings_status_idx" ON "earnings"("status");

-- CreateIndex
CREATE INDEX "earnings_availableAt_idx" ON "earnings"("availableAt");

-- CreateIndex
CREATE INDEX "payouts_proProfileId_idx" ON "payouts"("proProfileId");

-- CreateIndex
CREATE INDEX "payouts_status_idx" ON "payouts"("status");

-- CreateIndex
CREATE UNIQUE INDEX "payout_items_earningId_key" ON "payout_items"("earningId");

-- CreateIndex
CREATE INDEX "payout_items_payoutId_idx" ON "payout_items"("payoutId");

-- CreateIndex
CREATE INDEX "payout_items_earningId_idx" ON "payout_items"("earningId");

-- AddForeignKey
ALTER TABLE "pro_payout_profiles" ADD CONSTRAINT "pro_payout_profiles_proProfileId_fkey" FOREIGN KEY ("proProfileId") REFERENCES "pro_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "earnings" ADD CONSTRAINT "earnings_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "earnings" ADD CONSTRAINT "earnings_proProfileId_fkey" FOREIGN KEY ("proProfileId") REFERENCES "pro_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payouts" ADD CONSTRAINT "payouts_proProfileId_fkey" FOREIGN KEY ("proProfileId") REFERENCES "pro_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payout_items" ADD CONSTRAINT "payout_items_payoutId_fkey" FOREIGN KEY ("payoutId") REFERENCES "payouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payout_items" ADD CONSTRAINT "payout_items_earningId_fkey" FOREIGN KEY ("earningId") REFERENCES "earnings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
