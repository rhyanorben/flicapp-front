-- CreateExtension: pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Fix NULL updatedAt values before any other changes
UPDATE "public"."user_role_assignment" 
SET "updatedAt" = COALESCE("updatedAt", "createdAt", NOW())
WHERE "updatedAt" IS NULL;

-- Ensure updatedAt has a default value
ALTER TABLE "public"."user_role_assignment" 
  ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable: Update user_role_assignment.id to UUID
-- First, generate new UUIDs for existing records
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'user_role_assignment' 
            AND column_name = 'id'
            AND udt_name != 'uuid') THEN
  -- Generate new UUIDs for all existing records
  UPDATE "public"."user_role_assignment" 
  SET "id" = gen_random_uuid()::text
  WHERE "id" IS NOT NULL;
  
  -- Now convert the column type to UUID
  ALTER TABLE "public"."user_role_assignment" ALTER COLUMN "id" TYPE UUID USING "id"::uuid;
  ALTER TABLE "public"."user_role_assignment" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
 END IF;
END $$;

-- Drop existing unique index if it exists (created with default name)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' 
    AND tablename = 'user_role_assignment' 
    AND indexname = 'user_role_assignment_userId_roleId_key'
  ) THEN
    DROP INDEX IF EXISTS "public"."user_role_assignment_userId_roleId_key";
  END IF;
END $$;

-- Create unique index with specific name for ON CONFLICT
CREATE UNIQUE INDEX IF NOT EXISTS "ux_ura_user_role"
  ON "public"."user_role_assignment" ("userId", "roleId");

