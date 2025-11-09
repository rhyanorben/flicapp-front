-- AlterTable
DO $$ BEGIN
 ALTER TABLE "public"."provider_request" ADD COLUMN IF NOT EXISTS "rejectionReason" TEXT;
EXCEPTION
 WHEN duplicate_column THEN null;
END $$;
