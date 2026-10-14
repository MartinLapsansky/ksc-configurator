-- AlterTable
ALTER TABLE "User" ADD COLUMN     "counties" TEXT[] DEFAULT ARRAY[]::TEXT[];
