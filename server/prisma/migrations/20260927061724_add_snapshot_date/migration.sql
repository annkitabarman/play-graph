-- AlterTable
ALTER TABLE "PlaytimeSnapshot" ALTER COLUMN "snapshotDate" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "PlaytimeSnapshot_userId_gameId_snapshotDate_idx" ON "PlaytimeSnapshot"("userId", "gameId", "snapshotDate");
