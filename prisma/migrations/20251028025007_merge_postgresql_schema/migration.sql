/*
  Warnings:

  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."account" DROP CONSTRAINT IF EXISTS "account_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."provider_request" DROP CONSTRAINT IF EXISTS "provider_request_reviewedBy_fkey";

-- DropForeignKey
ALTER TABLE "public"."provider_request" DROP CONSTRAINT IF EXISTS "provider_request_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."session" DROP CONSTRAINT IF EXISTS "session_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."user_role_assignment" DROP CONSTRAINT IF EXISTS "user_role_assignment_userId_fkey";

-- AlterTable
ALTER TABLE "public"."session" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE IF EXISTS "public"."user";

-- CreateTable
CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
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

-- Add missing columns to existing users table (if table already exists)
DO $$ BEGIN
 ALTER TABLE "public"."users" ADD COLUMN IF NOT EXISTS "role" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."users" ADD COLUMN IF NOT EXISTS "phoneE164" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."users" ADD COLUMN IF NOT EXISTS "whatsappId" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."users" ADD COLUMN IF NOT EXISTS "cpf" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

-- Make email nullable if it's not already (migration from old schema)
DO $$ BEGIN
 ALTER TABLE "public"."users" ALTER COLUMN "email" DROP NOT NULL;
EXCEPTION
 WHEN OTHERS THEN null;
END $$;

-- Convert users.id to UUID if it's currently TEXT
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'users' 
            AND column_name = 'id'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."users" ALTER COLUMN "id" TYPE UUID USING "id"::uuid;
 END IF;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "public"."addresses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
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

-- Add missing columns to existing addresses table
DO $$ BEGIN
 ALTER TABLE "public"."addresses" ADD COLUMN IF NOT EXISTS "userId" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."addresses" ADD COLUMN IF NOT EXISTS "lon" DOUBLE PRECISION;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."addresses" ADD COLUMN IF NOT EXISTS "lat" DOUBLE PRECISION;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "public"."provider_profiles" (
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
CREATE TABLE IF NOT EXISTS "public"."provider_availability" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "providerId" TEXT NOT NULL,
    "weekday" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,

    CONSTRAINT "provider_availability_pkey" PRIMARY KEY ("id")
);

-- Add missing columns to existing provider_availability table
DO $$ BEGIN
 ALTER TABLE "public"."provider_availability" ADD COLUMN IF NOT EXISTS "providerId" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."provider_availability" ADD COLUMN IF NOT EXISTS "weekday" INTEGER;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."provider_availability" ADD COLUMN IF NOT EXISTS "startTime" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."provider_availability" ADD COLUMN IF NOT EXISTS "endTime" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "public"."provider_categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
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

-- Add missing columns to existing provider_categories table
DO $$ BEGIN
 ALTER TABLE "public"."provider_categories" ADD COLUMN IF NOT EXISTS "providerId" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."provider_categories" ADD COLUMN IF NOT EXISTS "categoryId" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."provider_categories" ADD COLUMN IF NOT EXISTS "minPriceCents" INTEGER;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."provider_categories" ADD COLUMN IF NOT EXISTS "active" BOOLEAN DEFAULT true;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."provider_categories" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."provider_categories" ADD COLUMN IF NOT EXISTS "levelWeight" INTEGER DEFAULT 1;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."provider_categories" ADD COLUMN IF NOT EXISTS "expWeight" INTEGER DEFAULT 1;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."provider_categories" ADD COLUMN IF NOT EXISTS "score" DECIMAL(65,30);
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."provider_categories" ADD COLUMN IF NOT EXISTS "isAvailable" BOOLEAN DEFAULT true;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "public"."categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- Add missing columns to existing categories table
DO $$ BEGIN
 ALTER TABLE "public"."categories" ADD COLUMN IF NOT EXISTS "slug" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "public"."orders" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
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

-- Add missing columns to existing orders table
DO $$ BEGIN
 ALTER TABLE "public"."orders" ADD COLUMN IF NOT EXISTS "clientId" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."orders" ADD COLUMN IF NOT EXISTS "providerId" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."orders" ADD COLUMN IF NOT EXISTS "addressId" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."orders" ADD COLUMN IF NOT EXISTS "categoryId" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."orders" ADD COLUMN IF NOT EXISTS "description" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."orders" ADD COLUMN IF NOT EXISTS "status" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."orders" ADD COLUMN IF NOT EXISTS "depositMethod" TEXT DEFAULT 'avg_min_20';
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."orders" ADD COLUMN IF NOT EXISTS "depositBaseAvgCents" INTEGER;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."orders" ADD COLUMN IF NOT EXISTS "depositCents" INTEGER DEFAULT 0;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."orders" ADD COLUMN IF NOT EXISTS "slotStart" TIMESTAMP(3);
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."orders" ADD COLUMN IF NOT EXISTS "slotEnd" TIMESTAMP(3);
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."orders" ADD COLUMN IF NOT EXISTS "finalPriceCents" INTEGER;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."orders" ADD COLUMN IF NOT EXISTS "reviewStatus" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."orders" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."orders" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "public"."order_slots" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "orderId" TEXT NOT NULL,
    "label" TEXT,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "origin" TEXT NOT NULL,
    "chosen" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "order_slots_pkey" PRIMARY KEY ("id")
);

-- Add missing columns to existing order_slots table
DO $$ BEGIN
 ALTER TABLE "public"."order_slots" ADD COLUMN IF NOT EXISTS "orderId" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."order_slots" ADD COLUMN IF NOT EXISTS "label" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."order_slots" ADD COLUMN IF NOT EXISTS "startAt" TIMESTAMP(3);
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."order_slots" ADD COLUMN IF NOT EXISTS "endAt" TIMESTAMP(3);
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."order_slots" ADD COLUMN IF NOT EXISTS "origin" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."order_slots" ADD COLUMN IF NOT EXISTS "chosen" BOOLEAN DEFAULT false;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "public"."order_categories" (
    "orderId" TEXT NOT NULL,
    "categorySlug" TEXT NOT NULL,
    "confidence" DECIMAL(65,30) NOT NULL,
    "rank" INTEGER NOT NULL,

    CONSTRAINT "order_categories_pkey" PRIMARY KEY ("orderId","categorySlug")
);

-- Add missing columns to existing order_categories table
DO $$ BEGIN
 ALTER TABLE "public"."order_categories" ADD COLUMN IF NOT EXISTS "orderId" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."order_categories" ADD COLUMN IF NOT EXISTS "categorySlug" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."order_categories" ADD COLUMN IF NOT EXISTS "confidence" DECIMAL(65,30);
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."order_categories" ADD COLUMN IF NOT EXISTS "rank" INTEGER;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "public"."order_invitations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
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

-- Add missing columns to existing order_invitations table
DO $$ BEGIN
 ALTER TABLE "public"."order_invitations" ADD COLUMN IF NOT EXISTS "orderId" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."order_invitations" ADD COLUMN IF NOT EXISTS "providerId" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."order_invitations" ADD COLUMN IF NOT EXISTS "slotId" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."order_invitations" ADD COLUMN IF NOT EXISTS "score" DECIMAL(65,30);
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."order_invitations" ADD COLUMN IF NOT EXISTS "sentAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."order_invitations" ADD COLUMN IF NOT EXISTS "respondedAt" TIMESTAMP(3);
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."order_invitations" ADD COLUMN IF NOT EXISTS "response" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."order_invitations" ADD COLUMN IF NOT EXISTS "waMessageId" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."order_invitations" ADD COLUMN IF NOT EXISTS "waRemoteJid" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."order_invitations" ADD COLUMN IF NOT EXISTS "categorySlug" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."order_invitations" ADD COLUMN IF NOT EXISTS "status" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."order_invitations" ADD COLUMN IF NOT EXISTS "expiresAt" TIMESTAMP(3);
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."order_invitations" ADD COLUMN IF NOT EXISTS "meta" JSONB;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "public"."order_status_history" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "orderId" TEXT NOT NULL,
    "oldStatus" TEXT,
    "newStatus" TEXT NOT NULL,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "byUserId" TEXT,

    CONSTRAINT "order_status_history_pkey" PRIMARY KEY ("id")
);

-- Add missing columns to existing order_status_history table
DO $$ BEGIN
 ALTER TABLE "public"."order_status_history" ADD COLUMN IF NOT EXISTS "orderId" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."order_status_history" ADD COLUMN IF NOT EXISTS "oldStatus" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."order_status_history" ADD COLUMN IF NOT EXISTS "newStatus" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."order_status_history" ADD COLUMN IF NOT EXISTS "at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."order_status_history" ADD COLUMN IF NOT EXISTS "byUserId" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "public"."order_reviews" (
    "orderId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "rating" INTEGER,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_reviews_pkey" PRIMARY KEY ("orderId")
);

-- Add missing columns to existing order_reviews table
DO $$ BEGIN
 ALTER TABLE "public"."order_reviews" ADD COLUMN IF NOT EXISTS "clientId" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."order_reviews" ADD COLUMN IF NOT EXISTS "providerId" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."order_reviews" ADD COLUMN IF NOT EXISTS "rating" INTEGER;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."order_reviews" ADD COLUMN IF NOT EXISTS "comment" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."order_reviews" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."order_reviews" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "public"."payments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
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

-- Add missing columns to existing payments table
DO $$ BEGIN
 ALTER TABLE "public"."payments" ADD COLUMN IF NOT EXISTS "orderId" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."payments" ADD COLUMN IF NOT EXISTS "status" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."payments" ADD COLUMN IF NOT EXISTS "gatewayPaymentId" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."payments" ADD COLUMN IF NOT EXISTS "gateway" TEXT DEFAULT 'mercadopago';
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."payments" ADD COLUMN IF NOT EXISTS "kind" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."payments" ADD COLUMN IF NOT EXISTS "amountCents" INTEGER;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."payments" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."payments" ADD COLUMN IF NOT EXISTS "approvedAt" TIMESTAMP(3);
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "public"."payment_events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "paymentId" TEXT,
    "orderId" TEXT NOT NULL,
    "rawPayload" JSONB NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "signatureOk" BOOLEAN,

    CONSTRAINT "payment_events_pkey" PRIMARY KEY ("id")
);

-- Add missing columns to existing payment_events table
DO $$ BEGIN
 ALTER TABLE "public"."payment_events" ADD COLUMN IF NOT EXISTS "paymentId" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."payment_events" ADD COLUMN IF NOT EXISTS "orderId" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."payment_events" ADD COLUMN IF NOT EXISTS "rawPayload" JSONB;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."payment_events" ADD COLUMN IF NOT EXISTS "receivedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."payment_events" ADD COLUMN IF NOT EXISTS "signatureOk" BOOLEAN;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "public"."commissions" (
    "orderId" TEXT NOT NULL,
    "finalPriceCents" INTEGER NOT NULL,
    "rateBp" INTEGER NOT NULL DEFAULT 1200,
    "minCents" INTEGER NOT NULL DEFAULT 1000,
    "maxCents" INTEGER NOT NULL DEFAULT 4000,
    "computedCents" INTEGER NOT NULL,
    "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "commissions_pkey" PRIMARY KEY ("orderId")
);

-- Add missing columns to existing commissions table
DO $$ BEGIN
 ALTER TABLE "public"."commissions" ADD COLUMN IF NOT EXISTS "finalPriceCents" INTEGER;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."commissions" ADD COLUMN IF NOT EXISTS "rateBp" INTEGER DEFAULT 1200;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."commissions" ADD COLUMN IF NOT EXISTS "minCents" INTEGER DEFAULT 1000;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."commissions" ADD COLUMN IF NOT EXISTS "maxCents" INTEGER DEFAULT 4000;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."commissions" ADD COLUMN IF NOT EXISTS "computedCents" INTEGER;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."commissions" ADD COLUMN IF NOT EXISTS "computedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "public"."client_credits" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedCents" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "client_credits_pkey" PRIMARY KEY ("id")
);

-- Add missing columns to existing client_credits table
DO $$ BEGIN
 ALTER TABLE "public"."client_credits" ADD COLUMN IF NOT EXISTS "userId" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."client_credits" ADD COLUMN IF NOT EXISTS "orderId" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."client_credits" ADD COLUMN IF NOT EXISTS "amountCents" INTEGER;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."client_credits" ADD COLUMN IF NOT EXISTS "expiresAt" TIMESTAMP(3);
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."client_credits" ADD COLUMN IF NOT EXISTS "usedCents" INTEGER DEFAULT 0;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."client_credits" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "public"."provider_payouts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "orderId" TEXT,
    "providerId" TEXT NOT NULL,
    "grossCents" INTEGER NOT NULL,
    "commissionCents" INTEGER NOT NULL,
    "netCents" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "paidAt" TIMESTAMP(3),

    CONSTRAINT "provider_payouts_pkey" PRIMARY KEY ("id")
);

-- Add missing columns to existing provider_payouts table
DO $$ BEGIN
 ALTER TABLE "public"."provider_payouts" ADD COLUMN IF NOT EXISTS "orderId" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."provider_payouts" ADD COLUMN IF NOT EXISTS "providerId" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."provider_payouts" ADD COLUMN IF NOT EXISTS "grossCents" INTEGER;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."provider_payouts" ADD COLUMN IF NOT EXISTS "commissionCents" INTEGER;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."provider_payouts" ADD COLUMN IF NOT EXISTS "netCents" INTEGER;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."provider_payouts" ADD COLUMN IF NOT EXISTS "status" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."provider_payouts" ADD COLUMN IF NOT EXISTS "paidAt" TIMESTAMP(3);
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "public"."match_scores" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
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

-- Add missing columns to existing match_scores table
DO $$ BEGIN
 ALTER TABLE "public"."match_scores" ADD COLUMN IF NOT EXISTS "orderId" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."match_scores" ADD COLUMN IF NOT EXISTS "providerId" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."match_scores" ADD COLUMN IF NOT EXISTS "distanceKm" DECIMAL(65,30);
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."match_scores" ADD COLUMN IF NOT EXISTS "ratingNorm" DECIMAL(65,30);
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."match_scores" ADD COLUMN IF NOT EXISTS "acceptRate" DECIMAL(65,30);
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."match_scores" ADD COLUMN IF NOT EXISTS "responseFast" DECIMAL(65,30);
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."match_scores" ADD COLUMN IF NOT EXISTS "reliability" DECIMAL(65,30);
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."match_scores" ADD COLUMN IF NOT EXISTS "finalScore" DECIMAL(65,30);
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."match_scores" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "public"."llm_classifications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "orderId" TEXT NOT NULL,
    "inputText" TEXT,
    "categoryId" TEXT,
    "confidence" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "llm_classifications_pkey" PRIMARY KEY ("id")
);

-- Add missing columns to existing llm_classifications table
DO $$ BEGIN
 ALTER TABLE "public"."llm_classifications" ADD COLUMN IF NOT EXISTS "orderId" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."llm_classifications" ADD COLUMN IF NOT EXISTS "inputText" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."llm_classifications" ADD COLUMN IF NOT EXISTS "categoryId" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."llm_classifications" ADD COLUMN IF NOT EXISTS "confidence" DECIMAL(65,30);
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."llm_classifications" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
EXCEPTION
 WHEN duplicate_column THEN null;
 WHEN undefined_table THEN null;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "public"."refusal_rules" (
    "code" TEXT NOT NULL,
    "clientCreditPct" INTEGER NOT NULL,
    "providerPct" INTEGER NOT NULL,
    "platformPct" INTEGER NOT NULL,

    CONSTRAINT "refusal_rules_pkey" PRIMARY KEY ("code")
);

-- CreateIndex
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'email') THEN
  CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "public"."users"("email");
 END IF;
END $$;

-- CreateIndex
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'phoneE164') THEN
  CREATE UNIQUE INDEX IF NOT EXISTS "users_phoneE164_key" ON "public"."users"("phoneE164");
 END IF;
END $$;

-- CreateIndex
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'addresses' AND column_name = 'lon') 
  AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'addresses' AND column_name = 'lat') THEN
  CREATE INDEX IF NOT EXISTS "addresses_lon_lat_idx" ON "public"."addresses"("lon", "lat");
 END IF;
END $$;

-- CreateIndex
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'provider_availability' AND column_name = 'providerId')
  AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'provider_availability' AND column_name = 'weekday')
  AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'provider_availability' AND column_name = 'startTime')
  AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'provider_availability' AND column_name = 'endTime') THEN
  CREATE UNIQUE INDEX IF NOT EXISTS "provider_availability_providerId_weekday_startTime_endTime_key" ON "public"."provider_availability"("providerId", "weekday", "startTime", "endTime");
 END IF;
END $$;

-- CreateIndex
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'provider_categories' AND column_name = 'categoryId')
  AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'provider_categories' AND column_name = 'isAvailable') THEN
  CREATE INDEX IF NOT EXISTS "provider_categories_categoryId_isAvailable_idx" ON "public"."provider_categories"("categoryId", "isAvailable");
 END IF;
END $$;

-- CreateIndex
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'provider_categories' AND column_name = 'categoryId')
  AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'provider_categories' AND column_name = 'score') THEN
  CREATE INDEX IF NOT EXISTS "provider_categories_categoryId_score_idx" ON "public"."provider_categories"("categoryId", "score" DESC);
 END IF;
END $$;

-- CreateIndex
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'provider_categories' AND column_name = 'categoryId')
  AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'provider_categories' AND column_name = 'active') THEN
  CREATE INDEX IF NOT EXISTS "provider_categories_categoryId_active_idx" ON "public"."provider_categories"("categoryId", "active");
 END IF;
END $$;

-- CreateIndex
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'provider_categories' AND column_name = 'providerId')
  AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'provider_categories' AND column_name = 'categoryId') THEN
  CREATE UNIQUE INDEX IF NOT EXISTS "provider_categories_providerId_categoryId_key" ON "public"."provider_categories"("providerId", "categoryId");
 END IF;
END $$;

-- CreateIndex
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'categories' AND column_name = 'slug') THEN
  CREATE UNIQUE INDEX IF NOT EXISTS "categories_slug_key" ON "public"."categories"("slug");
 END IF;
END $$;

-- CreateIndex
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'status')
  AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'createdAt') THEN
  CREATE INDEX IF NOT EXISTS "orders_status_createdAt_idx" ON "public"."orders"("status", "createdAt" DESC);
 END IF;
END $$;

-- CreateIndex
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'order_categories' AND column_name = 'orderId')
  AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'order_categories' AND column_name = 'rank') THEN
  CREATE INDEX IF NOT EXISTS "order_categories_orderId_rank_idx" ON "public"."order_categories"("orderId", "rank");
 END IF;
END $$;

-- CreateIndex
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'order_invitations' AND column_name = 'waMessageId') THEN
  CREATE UNIQUE INDEX IF NOT EXISTS "order_invitations_waMessageId_key" ON "public"."order_invitations"("waMessageId");
 END IF;
END $$;

-- CreateIndex
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'order_invitations' AND column_name = 'categorySlug')
  AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'order_invitations' AND column_name = 'slotId') THEN
  CREATE INDEX IF NOT EXISTS "order_invitations_categorySlug_slotId_idx" ON "public"."order_invitations"("categorySlug", "slotId");
 END IF;
END $$;

-- CreateIndex
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'order_invitations' AND column_name = 'categorySlug') 
  AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'order_invitations' AND column_name = 'slotId') THEN
  CREATE INDEX IF NOT EXISTS "order_invitations_orderId_categorySlug_slotId_idx" ON "public"."order_invitations"("orderId", "categorySlug", "slotId");
 END IF;
END $$;

-- CreateIndex
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'order_invitations' AND column_name = 'orderId')
  AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'order_invitations' AND column_name = 'expiresAt') THEN
  CREATE INDEX IF NOT EXISTS "idx_order_invitations_order_expires" ON "public"."order_invitations"("orderId", "expiresAt");
 END IF;
END $$;

-- CreateIndex
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'order_invitations' AND column_name = 'orderId')
  AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'order_invitations' AND column_name = 'providerId') THEN
  CREATE INDEX IF NOT EXISTS "order_invitations_orderId_providerId_idx" ON "public"."order_invitations"("orderId", "providerId");
 END IF;
END $$;

-- CreateIndex
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'order_invitations' AND column_name = 'orderId')
  AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'order_invitations' AND column_name = 'status') THEN
  CREATE INDEX IF NOT EXISTS "order_invitations_orderId_status_idx" ON "public"."order_invitations"("orderId", "status");
 END IF;
END $$;

-- CreateIndex
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'order_invitations' AND column_name = 'providerId')
  AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'order_invitations' AND column_name = 'status') THEN
  CREATE INDEX IF NOT EXISTS "order_invitations_providerId_status_idx" ON "public"."order_invitations"("providerId", "status");
 END IF;
END $$;

-- CreateIndex
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'order_invitations' AND column_name = 'waMessageId') THEN
  CREATE INDEX IF NOT EXISTS "order_invitations_waMessageId_idx" ON "public"."order_invitations"("waMessageId");
 END IF;
END $$;

-- CreateIndex
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'order_invitations' AND column_name = 'orderId')
  AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'order_invitations' AND column_name = 'sentAt') THEN
  CREATE INDEX IF NOT EXISTS "order_invitations_orderId_sentAt_idx" ON "public"."order_invitations"("orderId", "sentAt");
 END IF;
END $$;

-- CreateIndex
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'order_invitations' AND column_name = 'orderId')
  AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'order_invitations' AND column_name = 'providerId') THEN
  CREATE UNIQUE INDEX IF NOT EXISTS "order_invitations_orderId_providerId_key" ON "public"."order_invitations"("orderId", "providerId");
 END IF;
END $$;

-- CreateIndex
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'payments' AND column_name = 'gatewayPaymentId') THEN
  CREATE UNIQUE INDEX IF NOT EXISTS "payments_gatewayPaymentId_key" ON "public"."payments"("gatewayPaymentId");
 END IF;
END $$;

-- CreateIndex
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'payments' AND column_name = 'orderId')
  AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'payments' AND column_name = 'status') THEN
  CREATE INDEX IF NOT EXISTS "payments_orderId_status_idx" ON "public"."payments"("orderId", "status");
 END IF;
END $$;

-- CreateIndex
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'payments' AND column_name = 'gateway') 
  AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'payments' AND column_name = 'gatewayPaymentId') THEN
  CREATE UNIQUE INDEX IF NOT EXISTS "payments_gateway_gatewayPaymentId_key" ON "public"."payments"("gateway", "gatewayPaymentId");
 END IF;
END $$;

-- CreateIndex
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_credits' AND column_name = 'userId')
  AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_credits' AND column_name = 'expiresAt') THEN
  CREATE INDEX IF NOT EXISTS "client_credits_userId_expiresAt_idx" ON "public"."client_credits"("userId", "expiresAt");
 END IF;
END $$;

-- CreateIndex
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'provider_payouts' AND column_name = 'orderId') THEN
  CREATE UNIQUE INDEX IF NOT EXISTS "provider_payouts_orderId_key" ON "public"."provider_payouts"("orderId");
 END IF;
END $$;

-- Convert all table id columns to UUID if they are currently TEXT
-- This must happen before converting reference columns
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'addresses' 
            AND column_name = 'id'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."addresses" ALTER COLUMN "id" TYPE UUID USING "id"::uuid;
 END IF;
END $$;

DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'categories' 
            AND column_name = 'id'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."categories" ALTER COLUMN "id" TYPE UUID USING "id"::uuid;
 END IF;
END $$;

DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'orders' 
            AND column_name = 'id'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."orders" ALTER COLUMN "id" TYPE UUID USING "id"::uuid;
 END IF;
END $$;

DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'order_slots' 
            AND column_name = 'id'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."order_slots" ALTER COLUMN "id" TYPE UUID USING "id"::uuid;
 END IF;
END $$;

DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'payments' 
            AND column_name = 'id'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."payments" ALTER COLUMN "id" TYPE UUID USING "id"::uuid;
 END IF;
END $$;

DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'provider_availability' 
            AND column_name = 'id'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."provider_availability" ALTER COLUMN "id" TYPE UUID USING "id"::uuid;
 END IF;
END $$;

DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'provider_categories' 
            AND column_name = 'id'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."provider_categories" ALTER COLUMN "id" TYPE UUID USING "id"::uuid;
 END IF;
END $$;

DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'order_invitations' 
            AND column_name = 'id'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."order_invitations" ALTER COLUMN "id" TYPE UUID USING "id"::uuid;
 END IF;
END $$;

DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'order_status_history' 
            AND column_name = 'id'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."order_status_history" ALTER COLUMN "id" TYPE UUID USING "id"::uuid;
 END IF;
END $$;

DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'payment_events' 
            AND column_name = 'id'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."payment_events" ALTER COLUMN "id" TYPE UUID USING "id"::uuid;
 END IF;
END $$;

DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'client_credits' 
            AND column_name = 'id'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."client_credits" ALTER COLUMN "id" TYPE UUID USING "id"::uuid;
 END IF;
END $$;

DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'provider_payouts' 
            AND column_name = 'id'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."provider_payouts" ALTER COLUMN "id" TYPE UUID USING "id"::uuid;
 END IF;
END $$;

DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'match_scores' 
            AND column_name = 'id'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."match_scores" ALTER COLUMN "id" TYPE UUID USING "id"::uuid;
 END IF;
END $$;

DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'llm_classifications' 
            AND column_name = 'id'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."llm_classifications" ALTER COLUMN "id" TYPE UUID USING "id"::uuid;
 END IF;
END $$;

-- Convert userId columns to UUID to match users.id type
-- This must happen before creating foreign keys
-- Convert user_role_assignment.userId from TEXT to UUID
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'user_role_assignment' 
            AND column_name = 'userId'
            AND udt_name != 'uuid') THEN
  -- Convert TEXT to UUID - use quoted column name to preserve case
  ALTER TABLE "public"."user_role_assignment" ALTER COLUMN "userId" TYPE UUID USING "userId"::uuid;
 END IF;
END $$;

DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'session' 
            AND column_name = 'userId'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."session" ALTER COLUMN "userId" TYPE UUID USING "userId"::uuid;
 END IF;
END $$;

DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'account' 
            AND column_name = 'userId'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."account" ALTER COLUMN "userId" TYPE UUID USING "userId"::uuid;
 END IF;
END $$;

DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'provider_request' 
            AND column_name = 'userId'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."provider_request" ALTER COLUMN "userId" TYPE UUID USING "userId"::uuid;
 END IF;
END $$;

DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'provider_request' 
            AND column_name = 'reviewedBy'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."provider_request" ALTER COLUMN "reviewedBy" TYPE UUID USING "reviewedBy"::uuid;
 END IF;
END $$;

DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'addresses' 
            AND column_name = 'userId'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."addresses" ALTER COLUMN "userId" TYPE UUID USING "userId"::uuid;
 END IF;
END $$;

DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'provider_profiles' 
            AND column_name = 'userId'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."provider_profiles" ALTER COLUMN "userId" TYPE UUID USING "userId"::uuid;
 END IF;
END $$;

DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'provider_availability' 
            AND column_name = 'providerId'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."provider_availability" ALTER COLUMN "providerId" TYPE UUID USING "providerId"::uuid;
 END IF;
END $$;

DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'provider_categories' 
            AND column_name = 'providerId'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."provider_categories" ALTER COLUMN "providerId" TYPE UUID USING "providerId"::uuid;
 END IF;
END $$;

DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'orders' 
            AND column_name = 'clientId'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."orders" ALTER COLUMN "clientId" TYPE UUID USING "clientId"::uuid;
 END IF;
END $$;

DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'orders' 
            AND column_name = 'providerId'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."orders" ALTER COLUMN "providerId" TYPE UUID USING "providerId"::uuid;
 END IF;
END $$;

DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'order_invitations' 
            AND column_name = 'providerId'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."order_invitations" ALTER COLUMN "providerId" TYPE UUID USING "providerId"::uuid;
 END IF;
END $$;

DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'order_status_history' 
            AND column_name = 'byUserId'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."order_status_history" ALTER COLUMN "byUserId" TYPE UUID USING "byUserId"::uuid;
 END IF;
END $$;

DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'order_reviews' 
            AND column_name = 'clientId'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."order_reviews" ALTER COLUMN "clientId" TYPE UUID USING "clientId"::uuid;
 END IF;
END $$;

DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'order_reviews' 
            AND column_name = 'providerId'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."order_reviews" ALTER COLUMN "providerId" TYPE UUID USING "providerId"::uuid;
 END IF;
END $$;

DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'client_credits' 
            AND column_name = 'userId'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."client_credits" ALTER COLUMN "userId" TYPE UUID USING "userId"::uuid;
 END IF;
END $$;

DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'provider_payouts' 
            AND column_name = 'providerId'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."provider_payouts" ALTER COLUMN "providerId" TYPE UUID USING "providerId"::uuid;
 END IF;
END $$;

DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'match_scores' 
            AND column_name = 'providerId'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."match_scores" ALTER COLUMN "providerId" TYPE UUID USING "providerId"::uuid;
 END IF;
END $$;

-- Convert all reference columns to UUID
-- Convert addressId columns
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'orders' 
            AND column_name = 'addressId'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."orders" ALTER COLUMN "addressId" TYPE UUID USING "addressId"::uuid;
 END IF;
END $$;

-- Convert categoryId columns
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'orders' 
            AND column_name = 'categoryId'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."orders" ALTER COLUMN "categoryId" TYPE UUID USING "categoryId"::uuid;
 END IF;
END $$;

DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'provider_categories' 
            AND column_name = 'categoryId'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."provider_categories" ALTER COLUMN "categoryId" TYPE UUID USING "categoryId"::uuid;
 END IF;
END $$;

DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'llm_classifications' 
            AND column_name = 'categoryId'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."llm_classifications" ALTER COLUMN "categoryId" TYPE UUID USING "categoryId"::uuid;
 END IF;
END $$;

-- Convert orderId columns
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'order_slots' 
            AND column_name = 'orderId'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."order_slots" ALTER COLUMN "orderId" TYPE UUID USING "orderId"::uuid;
 END IF;
END $$;

DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'order_categories' 
            AND column_name = 'orderId'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."order_categories" ALTER COLUMN "orderId" TYPE UUID USING "orderId"::uuid;
 END IF;
END $$;

DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'order_invitations' 
            AND column_name = 'orderId'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."order_invitations" ALTER COLUMN "orderId" TYPE UUID USING "orderId"::uuid;
 END IF;
END $$;

DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'order_status_history' 
            AND column_name = 'orderId'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."order_status_history" ALTER COLUMN "orderId" TYPE UUID USING "orderId"::uuid;
 END IF;
END $$;

DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'order_reviews' 
            AND column_name = 'orderId'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."order_reviews" ALTER COLUMN "orderId" TYPE UUID USING "orderId"::uuid;
 END IF;
END $$;

DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'payments' 
            AND column_name = 'orderId'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."payments" ALTER COLUMN "orderId" TYPE UUID USING "orderId"::uuid;
 END IF;
END $$;

DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'payment_events' 
            AND column_name = 'orderId'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."payment_events" ALTER COLUMN "orderId" TYPE UUID USING "orderId"::uuid;
 END IF;
END $$;

DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'commissions' 
            AND column_name = 'orderId'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."commissions" ALTER COLUMN "orderId" TYPE UUID USING "orderId"::uuid;
 END IF;
END $$;

DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'client_credits' 
            AND column_name = 'orderId'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."client_credits" ALTER COLUMN "orderId" TYPE UUID USING "orderId"::uuid;
 END IF;
END $$;

DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'provider_payouts' 
            AND column_name = 'orderId'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."provider_payouts" ALTER COLUMN "orderId" TYPE UUID USING "orderId"::uuid;
 END IF;
END $$;

DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'match_scores' 
            AND column_name = 'orderId'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."match_scores" ALTER COLUMN "orderId" TYPE UUID USING "orderId"::uuid;
 END IF;
END $$;

DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'llm_classifications' 
            AND column_name = 'orderId'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."llm_classifications" ALTER COLUMN "orderId" TYPE UUID USING "orderId"::uuid;
 END IF;
END $$;

-- Convert paymentId columns
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'payment_events' 
            AND column_name = 'paymentId'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."payment_events" ALTER COLUMN "paymentId" TYPE UUID USING "paymentId"::uuid;
 END IF;
END $$;

-- Convert slotId columns
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'order_invitations' 
            AND column_name = 'slotId'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."order_invitations" ALTER COLUMN "slotId" TYPE UUID USING "slotId"::uuid;
 END IF;
END $$;

-- AddForeignKey
-- Verify that userId column is UUID before creating foreign key
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'user_role_assignment' 
            AND column_name = 'userId'
            AND udt_name = 'uuid') THEN
  ALTER TABLE "public"."user_role_assignment" ADD CONSTRAINT "user_role_assignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
 END IF;
EXCEPTION
 WHEN duplicate_object THEN null;
 WHEN OTHERS THEN 
  RAISE NOTICE 'Failed to create foreign key for user_role_assignment.userId: %', SQLERRM;
END $$;

-- AddForeignKey
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'session' 
            AND column_name = 'userId'
            AND udt_name = 'uuid') THEN
  ALTER TABLE "public"."session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
 END IF;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- AddForeignKey
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'account' 
            AND column_name = 'userId'
            AND udt_name = 'uuid') THEN
  ALTER TABLE "public"."account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
 END IF;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- AddForeignKey
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'provider_request' 
            AND column_name = 'userId'
            AND udt_name = 'uuid') THEN
  ALTER TABLE "public"."provider_request" ADD CONSTRAINT "provider_request_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
 END IF;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- AddForeignKey
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'provider_request' 
            AND column_name = 'reviewedBy'
            AND udt_name = 'uuid') THEN
  ALTER TABLE "public"."provider_request" ADD CONSTRAINT "provider_request_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
 END IF;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- AddForeignKey
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'addresses' 
            AND column_name = 'userId'
            AND udt_name = 'uuid') THEN
  ALTER TABLE "public"."addresses" ADD CONSTRAINT "addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
 END IF;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- AddForeignKey
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'provider_profiles' 
            AND column_name = 'userId'
            AND udt_name = 'uuid') THEN
  ALTER TABLE "public"."provider_profiles" ADD CONSTRAINT "provider_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
 END IF;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- AddForeignKey
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'provider_availability' 
            AND column_name = 'providerId'
            AND udt_name = 'uuid') THEN
  ALTER TABLE "public"."provider_availability" ADD CONSTRAINT "provider_availability_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
 END IF;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- AddForeignKey
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'provider_categories' 
            AND column_name = 'providerId'
            AND udt_name = 'uuid') THEN
  ALTER TABLE "public"."provider_categories" ADD CONSTRAINT "provider_categories_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
 END IF;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- AddForeignKey
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'provider_categories' 
            AND column_name = 'categoryId'
            AND udt_name = 'uuid') THEN
  ALTER TABLE "public"."provider_categories" ADD CONSTRAINT "provider_categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
 END IF;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- AddForeignKey
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'orders' 
            AND column_name = 'clientId'
            AND udt_name = 'uuid') THEN
  ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
 END IF;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- AddForeignKey
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'orders' 
            AND column_name = 'providerId'
            AND udt_name = 'uuid') THEN
  ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
 END IF;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- AddForeignKey
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'orders' 
            AND column_name = 'addressId'
            AND udt_name = 'uuid') THEN
  ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "public"."addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
 END IF;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- AddForeignKey
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'orders' 
            AND column_name = 'categoryId'
            AND udt_name = 'uuid') THEN
  ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
 END IF;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- AddForeignKey
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'order_slots' 
            AND column_name = 'orderId'
            AND udt_name = 'uuid') THEN
  ALTER TABLE "public"."order_slots" ADD CONSTRAINT "order_slots_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
 END IF;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- AddForeignKey
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'order_categories' 
            AND column_name = 'orderId'
            AND udt_name = 'uuid') THEN
  ALTER TABLE "public"."order_categories" ADD CONSTRAINT "order_categories_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
 END IF;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- AddForeignKey
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'order_invitations' 
            AND column_name = 'orderId'
            AND udt_name = 'uuid') THEN
  ALTER TABLE "public"."order_invitations" ADD CONSTRAINT "order_invitations_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
 END IF;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- AddForeignKey
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'order_invitations' 
            AND column_name = 'providerId'
            AND udt_name = 'uuid') THEN
  ALTER TABLE "public"."order_invitations" ADD CONSTRAINT "order_invitations_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
 END IF;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- AddForeignKey
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'order_invitations' 
            AND column_name = 'slotId'
            AND udt_name = 'uuid') THEN
  ALTER TABLE "public"."order_invitations" ADD CONSTRAINT "order_invitations_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "public"."order_slots"("id") ON DELETE SET NULL ON UPDATE CASCADE;
 END IF;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- AddForeignKey
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'order_status_history' 
            AND column_name = 'orderId'
            AND udt_name = 'uuid') THEN
  ALTER TABLE "public"."order_status_history" ADD CONSTRAINT "order_status_history_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
 END IF;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- AddForeignKey
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'order_status_history' 
            AND column_name = 'byUserId'
            AND udt_name = 'uuid') THEN
  ALTER TABLE "public"."order_status_history" ADD CONSTRAINT "order_status_history_byUserId_fkey" FOREIGN KEY ("byUserId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
 END IF;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- AddForeignKey
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'order_reviews' 
            AND column_name = 'orderId'
            AND udt_name = 'uuid') THEN
  ALTER TABLE "public"."order_reviews" ADD CONSTRAINT "order_reviews_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
 END IF;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- AddForeignKey
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'order_reviews' 
            AND column_name = 'clientId'
            AND udt_name = 'uuid') THEN
  ALTER TABLE "public"."order_reviews" ADD CONSTRAINT "order_reviews_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
 END IF;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- AddForeignKey
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'order_reviews' 
            AND column_name = 'providerId'
            AND udt_name = 'uuid') THEN
  ALTER TABLE "public"."order_reviews" ADD CONSTRAINT "order_reviews_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
 END IF;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- AddForeignKey
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'payments' 
            AND column_name = 'orderId'
            AND udt_name = 'uuid') THEN
  ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
 END IF;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- AddForeignKey
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'payment_events' 
            AND column_name = 'paymentId'
            AND udt_name = 'uuid') THEN
  ALTER TABLE "public"."payment_events" ADD CONSTRAINT "payment_events_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "public"."payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
 END IF;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- AddForeignKey
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'payment_events' 
            AND column_name = 'orderId'
            AND udt_name = 'uuid') THEN
  ALTER TABLE "public"."payment_events" ADD CONSTRAINT "payment_events_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
 END IF;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- AddForeignKey
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'commissions' 
            AND column_name = 'orderId'
            AND udt_name = 'uuid') THEN
  ALTER TABLE "public"."commissions" ADD CONSTRAINT "commissions_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
 END IF;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- AddForeignKey
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'client_credits' 
            AND column_name = 'userId'
            AND udt_name = 'uuid') THEN
  ALTER TABLE "public"."client_credits" ADD CONSTRAINT "client_credits_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
 END IF;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- AddForeignKey
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'client_credits' 
            AND column_name = 'orderId'
            AND udt_name = 'uuid') THEN
  ALTER TABLE "public"."client_credits" ADD CONSTRAINT "client_credits_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
 END IF;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- AddForeignKey
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'provider_payouts' 
            AND column_name = 'orderId'
            AND udt_name = 'uuid') THEN
  ALTER TABLE "public"."provider_payouts" ADD CONSTRAINT "provider_payouts_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
 END IF;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- AddForeignKey
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'provider_payouts' 
            AND column_name = 'providerId'
            AND udt_name = 'uuid') THEN
  ALTER TABLE "public"."provider_payouts" ADD CONSTRAINT "provider_payouts_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
 END IF;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- AddForeignKey
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'match_scores' 
            AND column_name = 'orderId'
            AND udt_name = 'uuid') THEN
  ALTER TABLE "public"."match_scores" ADD CONSTRAINT "match_scores_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
 END IF;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- AddForeignKey
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'match_scores' 
            AND column_name = 'providerId'
            AND udt_name = 'uuid') THEN
  ALTER TABLE "public"."match_scores" ADD CONSTRAINT "match_scores_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
 END IF;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- AddForeignKey
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'llm_classifications' 
            AND column_name = 'orderId'
            AND udt_name = 'uuid') THEN
  ALTER TABLE "public"."llm_classifications" ADD CONSTRAINT "llm_classifications_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
 END IF;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- AddForeignKey
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'llm_classifications' 
            AND column_name = 'categoryId'
            AND udt_name = 'uuid') THEN
  ALTER TABLE "public"."llm_classifications" ADD CONSTRAINT "llm_classifications_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
 END IF;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
