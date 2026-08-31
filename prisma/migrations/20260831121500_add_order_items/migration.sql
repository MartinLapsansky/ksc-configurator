-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "config" JSONB NOT NULL,
    "orderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- Migrate existing single-config orders into the new OrderItem table,
-- preserving their quantity and config.
INSERT INTO "OrderItem" ("id", "quantity", "config", "orderId", "createdAt", "updatedAt")
SELECT 'item-' || "id", "quantity", "productConfig", "id", "createdAt", "updatedAt"
FROM "Order"
WHERE "productConfig" IS NOT NULL;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Drop the legacy single-config column now that configs live in OrderItem.
ALTER TABLE "Order" DROP COLUMN "productConfig";