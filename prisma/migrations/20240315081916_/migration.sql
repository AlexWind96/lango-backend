/*
  Warnings:

  - You are about to drop the column `viewed` on the `CardLearnProgress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CardLearnProgress" DROP COLUMN "viewed",
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;
