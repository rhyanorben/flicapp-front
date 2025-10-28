/*
  Warnings:

  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."account" DROP CONSTRAINT "account_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."provider_request" DROP CONSTRAINT "provider_request_reviewedBy_fkey";

-- DropForeignKey
ALTER TABLE "public"."provider_request" DROP CONSTRAINT "provider_request_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."session" DROP CONSTRAINT "session_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."user_role_assignment" DROP CONSTRAINT "user_role_assignment_userId_fkey";

-- AlterTable
ALTER TABLE "public"."session" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "public"."user";

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "email" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "role" TEXT,
    "phoneE164" TEXT,
    "whatsappId" TEXT,
    "cpf" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."addresses" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "userId" TEXT,
    "label" TEXT,
    "cep" TEXT,
    "street" TEXT,
    "number" TEXT,
    "complement" TEXT,
    "neighborhood" TEXT,
    "city" TEXT,
    "state" TEXT,
    "lat" DOUBLE PRECISION,
    "lon" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."provider_profiles" (
    "userId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "bio" TEXT,
    "radiusKm" DECIMAL(65,30) NOT NULL DEFAULT 10,
    "avgRating" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "acceptRate30d" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "responseP50S" INTEGER NOT NULL DEFAULT 0,
    "noShow30d" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "provider_profiles_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "public"."provider_availability" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "providerId" TEXT NOT NULL,
    "weekday" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,

    CONSTRAINT "provider_availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."provider_categories" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "providerId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "minPriceCents" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "levelWeight" INTEGER DEFAULT 1,
    "expWeight" INTEGER DEFAULT 1,
    "score" DECIMAL(65,30),
    "isAvailable" BOOLEAN DEFAULT true,

    CONSTRAINT "provider_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."categories" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."orders" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "clientId" TEXT NOT NULL,
    "providerId" TEXT,
    "addressId" TEXT,
    "categoryId" TEXT,
    "description" TEXT,
    "status" TEXT NOT NULL,
    "depositMethod" TEXT NOT NULL DEFAULT 'avg_min_20',
    "depositBaseAvgCents" INTEGER,
    "depositCents" INTEGER NOT NULL DEFAULT 0,
    "slotStart" TIMESTAMP(3),
    "slotEnd" TIMESTAMP(3),
    "finalPriceCents" INTEGER,
    "reviewStatus" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."order_slots" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "orderId" TEXT NOT NULL,
    "label" TEXT,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "origin" TEXT NOT NULL,
    "chosen" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "order_slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."order_categories" (
    "orderId" TEXT NOT NULL,
    "categorySlug" TEXT NOT NULL,
    "confidence" DECIMAL(65,30) NOT NULL,
    "rank" INTEGER NOT NULL,

    CONSTRAINT "order_categories_pkey" PRIMARY KEY ("orderId","categorySlug")
);

-- CreateTable
CREATE TABLE "public"."order_invitations" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "orderId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "slotId" TEXT,
    "score" DECIMAL(65,30),
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),
    "response" TEXT,
    "waMessageId" TEXT,
    "waRemoteJid" TEXT,
    "categorySlug" TEXT,
    "status" TEXT,
    "expiresAt" TIMESTAMP(3),
    "meta" JSONB,

    CONSTRAINT "order_invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."order_status_history" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "orderId" TEXT NOT NULL,
    "oldStatus" TEXT,
    "newStatus" TEXT NOT NULL,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "byUserId" TEXT,

    CONSTRAINT "order_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."order_reviews" (
    "orderId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "rating" INTEGER,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_reviews_pkey" PRIMARY KEY ("orderId")
);

-- CreateTable
CREATE TABLE "public"."payments" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "orderId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "gateway" TEXT NOT NULL DEFAULT 'mercadopago',
    "gatewayPaymentId" TEXT,
    "status" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payment_events" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "paymentId" TEXT,
    "orderId" TEXT NOT NULL,
    "rawPayload" JSONB NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "signatureOk" BOOLEAN,

    CONSTRAINT "payment_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."commissions" (
    "orderId" TEXT NOT NULL,
    "finalPriceCents" INTEGER NOT NULL,
    "rateBp" INTEGER NOT NULL DEFAULT 1200,
    "minCents" INTEGER NOT NULL DEFAULT 1000,
    "maxCents" INTEGER NOT NULL DEFAULT 4000,
    "computedCents" INTEGER NOT NULL,
    "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "commissions_pkey" PRIMARY KEY ("orderId")
);

-- CreateTable
CREATE TABLE "public"."client_credits" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "userId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedCents" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "client_credits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."provider_payouts" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "orderId" TEXT,
    "providerId" TEXT NOT NULL,
    "grossCents" INTEGER NOT NULL,
    "commissionCents" INTEGER NOT NULL,
    "netCents" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "paidAt" TIMESTAMP(3),

    CONSTRAINT "provider_payouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."match_scores" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "orderId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "distanceKm" DECIMAL(65,30),
    "ratingNorm" DECIMAL(65,30),
    "acceptRate" DECIMAL(65,30),
    "responseFast" DECIMAL(65,30),
    "reliability" DECIMAL(65,30),
    "finalScore" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "match_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."llm_classifications" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "orderId" TEXT NOT NULL,
    "inputText" TEXT,
    "categoryId" TEXT,
    "confidence" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "llm_classifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."refusal_rules" (
    "code" TEXT NOT NULL,
    "clientCreditPct" INTEGER NOT NULL,
    "providerPct" INTEGER NOT NULL,
    "platformPct" INTEGER NOT NULL,

    CONSTRAINT "refusal_rules_pkey" PRIMARY KEY ("code")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phoneE164_key" ON "public"."users"("phoneE164");

-- CreateIndex
CREATE INDEX "addresses_lon_lat_idx" ON "public"."addresses"("lon", "lat");

-- CreateIndex
CREATE UNIQUE INDEX "provider_availability_providerId_weekday_startTime_endTime_key" ON "public"."provider_availability"("providerId", "weekday", "startTime", "endTime");

-- CreateIndex
CREATE INDEX "provider_categories_categoryId_isAvailable_idx" ON "public"."provider_categories"("categoryId", "isAvailable");

-- CreateIndex
CREATE INDEX "provider_categories_categoryId_score_idx" ON "public"."provider_categories"("categoryId", "score" DESC);

-- CreateIndex
CREATE INDEX "provider_categories_categoryId_active_idx" ON "public"."provider_categories"("categoryId", "active");

-- CreateIndex
CREATE UNIQUE INDEX "provider_categories_providerId_categoryId_key" ON "public"."provider_categories"("providerId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "public"."categories"("slug");

-- CreateIndex
CREATE INDEX "orders_status_createdAt_idx" ON "public"."orders"("status", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "order_categories_orderId_rank_idx" ON "public"."order_categories"("orderId", "rank");

-- CreateIndex
CREATE UNIQUE INDEX "order_invitations_waMessageId_key" ON "public"."order_invitations"("waMessageId");

-- CreateIndex
CREATE INDEX "order_invitations_categorySlug_slotId_idx" ON "public"."order_invitations"("categorySlug", "slotId");

-- CreateIndex
CREATE INDEX "order_invitations_orderId_categorySlug_slotId_idx" ON "public"."order_invitations"("orderId", "categorySlug", "slotId");

-- CreateIndex
CREATE INDEX "idx_order_invitations_order_expires" ON "public"."order_invitations"("orderId", "expiresAt");

-- CreateIndex
CREATE INDEX "order_invitations_orderId_providerId_idx" ON "public"."order_invitations"("orderId", "providerId");

-- CreateIndex
CREATE INDEX "order_invitations_orderId_status_idx" ON "public"."order_invitations"("orderId", "status");

-- CreateIndex
CREATE INDEX "order_invitations_providerId_status_idx" ON "public"."order_invitations"("providerId", "status");

-- CreateIndex
CREATE INDEX "order_invitations_waMessageId_idx" ON "public"."order_invitations"("waMessageId");

-- CreateIndex
CREATE INDEX "order_invitations_orderId_sentAt_idx" ON "public"."order_invitations"("orderId", "sentAt");

-- CreateIndex
CREATE UNIQUE INDEX "order_invitations_orderId_providerId_key" ON "public"."order_invitations"("orderId", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_gatewayPaymentId_key" ON "public"."payments"("gatewayPaymentId");

-- CreateIndex
CREATE INDEX "payments_orderId_status_idx" ON "public"."payments"("orderId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "payments_gateway_gatewayPaymentId_key" ON "public"."payments"("gateway", "gatewayPaymentId");

-- CreateIndex
CREATE INDEX "client_credits_userId_expiresAt_idx" ON "public"."client_credits"("userId", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "provider_payouts_orderId_key" ON "public"."provider_payouts"("orderId");

-- AddForeignKey
ALTER TABLE "public"."user_role_assignment" ADD CONSTRAINT "user_role_assignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."provider_request" ADD CONSTRAINT "provider_request_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."provider_request" ADD CONSTRAINT "provider_request_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."addresses" ADD CONSTRAINT "addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."provider_profiles" ADD CONSTRAINT "provider_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."provider_availability" ADD CONSTRAINT "provider_availability_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."provider_categories" ADD CONSTRAINT "provider_categories_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."provider_categories" ADD CONSTRAINT "provider_categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "public"."addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_slots" ADD CONSTRAINT "order_slots_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_categories" ADD CONSTRAINT "order_categories_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_invitations" ADD CONSTRAINT "order_invitations_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_invitations" ADD CONSTRAINT "order_invitations_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_invitations" ADD CONSTRAINT "order_invitations_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "public"."order_slots"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_status_history" ADD CONSTRAINT "order_status_history_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_status_history" ADD CONSTRAINT "order_status_history_byUserId_fkey" FOREIGN KEY ("byUserId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_reviews" ADD CONSTRAINT "order_reviews_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_reviews" ADD CONSTRAINT "order_reviews_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_reviews" ADD CONSTRAINT "order_reviews_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payment_events" ADD CONSTRAINT "payment_events_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "public"."payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payment_events" ADD CONSTRAINT "payment_events_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."commissions" ADD CONSTRAINT "commissions_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."client_credits" ADD CONSTRAINT "client_credits_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."client_credits" ADD CONSTRAINT "client_credits_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."provider_payouts" ADD CONSTRAINT "provider_payouts_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."provider_payouts" ADD CONSTRAINT "provider_payouts_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."match_scores" ADD CONSTRAINT "match_scores_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."match_scores" ADD CONSTRAINT "match_scores_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."llm_classifications" ADD CONSTRAINT "llm_classifications_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."llm_classifications" ADD CONSTRAINT "llm_classifications_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
