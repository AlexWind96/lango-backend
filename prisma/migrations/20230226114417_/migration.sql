/*
  Warnings:

  - The primary key for the `folders` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `folders` table. All the data in the column will be lost.
  - You are about to drop the column `folderId` on the `modules` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "modules" DROP CONSTRAINT "modules_folderId_fkey";

-- AlterTable
ALTER TABLE "folders" DROP CONSTRAINT "folders_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "folders_pkey" PRIMARY KEY ("label");

-- AlterTable
ALTER TABLE "modules" DROP COLUMN "folderId",
ADD COLUMN     "folderLabel" TEXT;

-- AddForeignKey
ALTER TABLE "modules" ADD CONSTRAINT "modules_folderLabel_fkey" FOREIGN KEY ("folderLabel") REFERENCES "folders"("label") ON DELETE SET NULL ON UPDATE CASCADE;
