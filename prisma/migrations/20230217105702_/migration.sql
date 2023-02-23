-- AlterTable
ALTER TABLE "CardLearnProgress" ADD COLUMN     "countOfAnswers" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "countOfRightAnswers" INTEGER NOT NULL DEFAULT 0;
