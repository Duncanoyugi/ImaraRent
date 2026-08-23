-- Create PropertyManager table
CREATE TABLE "PropertyManager" (
    id TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "managerId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "PropertyManager_pkey" PRIMARY KEY (id)
);

-- Create unique constraint
CREATE UNIQUE INDEX "PropertyManager_propertyId_managerId_key" ON "PropertyManager"("propertyId", "managerId");

-- Create indexes
CREATE INDEX "PropertyManager_managerId_idx" ON "PropertyManager"("managerId");
CREATE INDEX "PropertyManager_propertyId_idx" ON "PropertyManager"("propertyId");

-- Add foreign key constraints
ALTER TABLE "PropertyManager" ADD CONSTRAINT "PropertyManager_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PropertyManager" ADD CONSTRAINT "PropertyManager_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"(id) ON UPDATE CASCADE;
