-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMINISTRADOR', 'PRESTADOR', 'CLIENTE');

-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "role" "public"."UserRole" NOT NULL DEFAULT 'CLIENTE';
