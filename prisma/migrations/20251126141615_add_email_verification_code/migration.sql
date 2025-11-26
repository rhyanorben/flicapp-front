-- CreateTable
CREATE TABLE IF NOT EXISTS "public"."email_verification_codes" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_verification_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "email_verification_codes_email_idx" ON "public"."email_verification_codes"("email");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "email_verification_codes_code_idx" ON "public"."email_verification_codes"("code");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "email_verification_codes_email_code_idx" ON "public"."email_verification_codes"("email", "code");

