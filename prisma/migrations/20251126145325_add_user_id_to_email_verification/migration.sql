-- Drop old indexes
DROP INDEX IF EXISTS "public"."email_verification_codes_email_idx";
DROP INDEX IF EXISTS "public"."email_verification_codes_email_code_idx";

-- Check if userId column already exists, if so drop it first
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'email_verification_codes' 
        AND column_name = 'userId'
    ) THEN
        ALTER TABLE "public"."email_verification_codes" DROP COLUMN "userId";
    END IF;
END $$;

-- Add userId column as UUID (nullable first) - matching User.id type
ALTER TABLE "public"."email_verification_codes" 
ADD COLUMN "userId" UUID;

-- Populate userId from users table based on email (if there are existing records)
UPDATE "public"."email_verification_codes" evc
SET "userId" = u.id
FROM "public"."users" u
WHERE evc.email = u.email AND evc."userId" IS NULL;

-- Delete any records that couldn't be matched to a user
DELETE FROM "public"."email_verification_codes" WHERE "userId" IS NULL;

-- Make userId NOT NULL
ALTER TABLE "public"."email_verification_codes" 
ALTER COLUMN "userId" SET NOT NULL;

-- Add foreign key constraint
ALTER TABLE "public"."email_verification_codes" 
ADD CONSTRAINT "email_verification_codes_userId_fkey" 
FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create new indexes
CREATE INDEX IF NOT EXISTS "email_verification_codes_userId_idx" ON "public"."email_verification_codes"("userId");
CREATE INDEX IF NOT EXISTS "email_verification_codes_userId_code_idx" ON "public"."email_verification_codes"("userId", "code");

