/*
  Warnings:

  - You are about to drop the column `date` on the `LearnSession` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `LearnSession` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UserSettings` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[settingsId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[learnSessionId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `LearnSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `learnSessionId` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `settingsId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LearnSession" DROP CONSTRAINT "LearnSession_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserSettings" DROP CONSTRAINT "UserSettings_userId_fkey";

-- DropIndex
DROP INDEX "LearnSession_userId_key";

-- DropIndex
DROP INDEX "UserSettings_userId_key";

-- AlterTable
ALTER TABLE "LearnSession" DROP COLUMN "date",
DROP COLUMN "userId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "UserSettings" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "learnSessionId" TEXT NOT NULL,
ADD COLUMN     "settingsId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_settingsId_key" ON "users"("settingsId");

-- CreateIndex
CREATE UNIQUE INDEX "users_learnSessionId_key" ON "users"("learnSessionId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_settingsId_fkey" FOREIGN KEY ("settingsId") REFERENCES "UserSettings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_learnSessionId_fkey" FOREIGN KEY ("learnSessionId") REFERENCES "LearnSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
