-- AlterTable: Update Session.id to UUID
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'session' 
            AND column_name = 'id'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."session" ALTER COLUMN "id" TYPE UUID USING "id"::uuid;
  ALTER TABLE "public"."session" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
 END IF;
END $$;

-- AlterTable: Update Account.id to UUID
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'account' 
            AND column_name = 'id'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."account" ALTER COLUMN "id" TYPE UUID USING "id"::uuid;
  ALTER TABLE "public"."account" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
 END IF;
END $$;

-- AlterTable: Update Verification.id to UUID
DO $$ 
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'verification' 
            AND column_name = 'id'
            AND udt_name != 'uuid') THEN
  ALTER TABLE "public"."verification" ALTER COLUMN "id" TYPE UUID USING "id"::uuid;
  ALTER TABLE "public"."verification" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
 END IF;
END $$;

