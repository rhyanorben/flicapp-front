-- AlterTable
ALTER TABLE "public"."provider_request" ADD COLUMN     "cep" TEXT,
ADD COLUMN     "portfolioLinksJson" JSONB,
ADD COLUMN     "services" JSONB;
