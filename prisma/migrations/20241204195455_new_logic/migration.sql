/*
  Warnings:

  - You are about to drop the column `accuracy` on the `CardLearnProgress` table. All the data in the column will be lost.
  - You are about to drop the column `complexity` on the `CardLearnProgress` table. All the data in the column will be lost.
  - You are about to drop the column `countOfAnswers` on the `CardLearnProgress` table. All the data in the column will be lost.
  - You are about to drop the column `countOfRightAnswers` on the `CardLearnProgress` table. All the data in the column will be lost.
  - You are about to drop the column `interval` on the `CardLearnProgress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CardLearnProgress" DROP COLUMN "accuracy",
DROP COLUMN "complexity",
DROP COLUMN "countOfAnswers",
DROP COLUMN "countOfRightAnswers",
DROP COLUMN "interval",
ADD COLUMN     "threshold" DOUBLE PRECISION NOT NULL DEFAULT 0.6,
ALTER COLUMN "step" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "growthRatio" DOUBLE PRECISION NOT NULL DEFAULT 0.2,
ADD COLUMN     "initialMemoryPersistence" DOUBLE PRECISION NOT NULL DEFAULT 0.25;

-- DropEnum
DROP TYPE "COMPLEXITY";
