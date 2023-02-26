/*
  Warnings:

  - The primary key for the `folders` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `folderLabel` on the `modules` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "modules" DROP CONSTRAINT "modules_folderId_folderLabel_fkey";

-- DropIndex
DROP INDEX "folders_id_key";

-- AlterTable
ALTER TABLE "folders" DROP CONSTRAINT "folders_pkey",
ADD CONSTRAINT "folders_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "modules" DROP COLUMN "folderLabel";

-- AddForeignKey
ALTER TABLE "modules" ADD CONSTRAINT "modules_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
