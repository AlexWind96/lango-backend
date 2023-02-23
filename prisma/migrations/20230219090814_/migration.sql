/*
  Warnings:

  - Added the required column `rightAnswers` to the `learnSessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "learnSessions" ADD COLUMN     "rightAnswers" INTEGER NOT NULL;
