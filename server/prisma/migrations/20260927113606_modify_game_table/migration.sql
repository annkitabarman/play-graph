-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "genres" TEXT[] DEFAULT ARRAY[]::TEXT[];
