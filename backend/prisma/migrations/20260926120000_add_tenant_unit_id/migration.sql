-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN IF NOT EXISTS "unitId" TEXT;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Tenant_unitId_idx" ON "Tenant"("unitId");

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Tenant_unitId_fkey'
  ) THEN
    ALTER TABLE "Tenant" ADD CONSTRAINT "Tenant_unitId_fkey"
      FOREIGN KEY ("unitId") REFERENCES "Unit"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
