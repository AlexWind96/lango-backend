/*
  Warnings:

  - The primary key for the `folders` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `folders` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "modules" DROP CONSTRAINT "modules_folderLabel_fkey";

-- AlterTable
ALTER TABLE "folders" DROP CONSTRAINT "folders_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "folders_pkey" PRIMARY KEY ("id", "label");

-- AlterTable
ALTER TABLE "modules" ADD COLUMN     "folderId" TEXT;

-- AddForeignKey
ALTER TABLE "modules" ADD CONSTRAINT "modules_folderId_folderLabel_fkey" FOREIGN KEY ("folderId", "folderLabel") REFERENCES "folders"("id", "label") ON DELETE SET NULL ON UPDATE CASCADE;
