-- CreateEnum
CREATE TYPE "public"."ProviderRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "public"."provider_request" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "documentNumber" TEXT NOT NULL,
    "portfolioLinks" TEXT,
    "status" "public"."ProviderRequestStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "provider_request_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."provider_request" ADD CONSTRAINT "provider_request_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."provider_request" ADD CONSTRAINT "provider_request_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
