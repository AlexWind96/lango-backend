/*
  Warnings:

  - You are about to drop the column `name` on the `folders` table. All the data in the column will be lost.
  - Added the required column `sentenceText` to the `cards` table without a default value. This is not possible if the table is not empty.
  - Added the required column `label` to the `folders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cards" ADD COLUMN     "sentenceText" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "folders" DROP COLUMN "name",
ADD COLUMN     "label" TEXT NOT NULL;
