/*
  Warnings:

  - You are about to drop the column `progress` on the `CardLearnProgress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CardLearnProgress" DROP COLUMN "progress",
ADD COLUMN     "step" INTEGER NOT NULL DEFAULT 1;
