/*
  Warnings:

  - You are about to drop the column `value` on the `Rating` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Rating" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
    "btRating" REAL NOT NULL DEFAULT 1000,
    "dynamicPoints" REAL NOT NULL DEFAULT 0,
    "atTime" DATETIME NOT NULL,
    "scope" TEXT NOT NULL DEFAULT 'all-time',
    "weekYear" INTEGER,
    "weekNumber" INTEGER,
    "monthYear" INTEGER,
    "monthNumber" INTEGER,
    "prevRank" INTEGER,
    "currentRank" INTEGER,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Rating_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Rating" ("atTime", "id", "playerId") SELECT "atTime", "id", "playerId" FROM "Rating";
DROP TABLE "Rating";
ALTER TABLE "new_Rating" RENAME TO "Rating";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
