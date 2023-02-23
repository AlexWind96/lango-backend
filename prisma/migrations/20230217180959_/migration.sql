/*
  Warnings:

  - You are about to drop the column `modules` on the `learnSessions` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `learnSessions` table. All the data in the column will be lost.
  - Changed the type of `completed` on the `learnSessions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "learnSessions" DROP COLUMN "modules",
DROP COLUMN "updatedAt",
DROP COLUMN "completed",
ADD COLUMN     "completed" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "CurrentLearnSession" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "countOfCompleted" INTEGER NOT NULL DEFAULT 0,
    "modules" TEXT[],

    CONSTRAINT "CurrentLearnSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CurrentLearnSession_userId_key" ON "CurrentLearnSession"("userId");

-- AddForeignKey
ALTER TABLE "CurrentLearnSession" ADD CONSTRAINT "CurrentLearnSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
