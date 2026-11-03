-- CreateTable
CREATE TABLE "ProductVersion" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "definition" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "hasBackView" BOOLEAN NOT NULL,
    "frontImageUrl" TEXT,
    "backImageUrl" TEXT,
    "coverImageUrl" TEXT,

    CONSTRAINT "ProductVersion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProductVersion_productId_idx" ON "ProductVersion"("productId");

-- CreateIndex
CREATE INDEX "ProductVersion_createdBy_idx" ON "ProductVersion"("createdBy");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVersion_productId_version_key" ON "ProductVersion"("productId", "version");

-- AddForeignKey
ALTER TABLE "ProductVersion" ADD CONSTRAINT "ProductVersion_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVersion" ADD CONSTRAINT "ProductVersion_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Backfill: create an initial version (1) for every existing product so the
-- history is complete from the moment this table is introduced.
INSERT INTO "ProductVersion" ("id", "productId", "version", "definition", "createdAt", "createdBy", "slug", "name", "categoryId", "active", "sortOrder", "hasBackView", "frontImageUrl", "backImageUrl", "coverImageUrl")
SELECT gen_random_uuid()::text, "id", 1, "definition", "createdAt", NULL, "slug", "name", "categoryId", "active", "sortOrder", "hasBackView", "frontImageUrl", "backImageUrl", "coverImageUrl"
FROM "Product";
