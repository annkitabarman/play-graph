/*
  Warnings:

  - You are about to drop the column `playerModes` on the `Game` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "playerModes",
ALTER COLUMN "genres" SET DEFAULT ARRAY[]::TEXT[];
