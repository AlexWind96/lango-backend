/*
  Warnings:

  - You are about to drop the column `completed` on the `learnSessions` table. All the data in the column will be lost.
  - Added the required column `rightAnswers` to the `CurrentLearnSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `countOfCompleted` to the `learnSessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isCompleted` to the `learnSessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CurrentLearnSession" ADD COLUMN     "rightAnswers" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "learnSessions" DROP COLUMN "completed",
ADD COLUMN     "countOfCompleted" INTEGER NOT NULL,
ADD COLUMN     "isCompleted" BOOLEAN NOT NULL;
