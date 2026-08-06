/*
  Warnings:

  - You are about to drop the column `leadTime` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "leadTime",
ADD COLUMN     "country" TEXT NOT NULL DEFAULT '';
