-- AlterTable
DO $$ BEGIN
 ALTER TABLE "public"."provider_request" ADD COLUMN IF NOT EXISTS "cep" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."provider_request" ADD COLUMN IF NOT EXISTS "portfolioLinksJson" JSONB;
EXCEPTION
 WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public"."provider_request" ADD COLUMN IF NOT EXISTS "services" JSONB;
EXCEPTION
 WHEN duplicate_column THEN null;
END $$;
