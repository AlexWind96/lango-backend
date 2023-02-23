/*
  Warnings:

  - You are about to drop the column `learnSessionId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `settingsId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `LearnSession` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserSettings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_learnSessionId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_settingsId_fkey";

-- DropIndex
DROP INDEX "users_learnSessionId_key";

-- DropIndex
DROP INDEX "users_settingsId_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "learnSessionId",
DROP COLUMN "settingsId",
ADD COLUMN     "learnGoal" INTEGER NOT NULL DEFAULT 50;

-- DropTable
DROP TABLE "LearnSession";

-- DropTable
DROP TABLE "UserSettings";

-- CreateTable
CREATE TABLE "learnSessions" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "completed" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "learnSessions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "learnSessions" ADD CONSTRAINT "learnSessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
