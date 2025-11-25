-- AlterTable: Make providerId nullable in order_invitations
ALTER TABLE "public"."order_invitations"
  ALTER COLUMN "providerId" DROP NOT NULL;


