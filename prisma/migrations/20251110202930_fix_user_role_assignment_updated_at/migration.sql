-- Fix NULL updatedAt values in user_role_assignment
UPDATE "public"."user_role_assignment" 
SET "updatedAt" = COALESCE("updatedAt", "createdAt", CURRENT_TIMESTAMP)
WHERE "updatedAt" IS NULL;

-- Ensure updatedAt has a default value and is NOT NULL
ALTER TABLE "public"."user_role_assignment" 
  ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP,
  ALTER COLUMN "updatedAt" SET NOT NULL;

