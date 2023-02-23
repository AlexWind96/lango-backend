/*
  Warnings:

  - The primary key for the `folders` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `modules` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `sentenceUnits` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "cards" DROP CONSTRAINT "cards_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "modules" DROP CONSTRAINT "modules_folderId_fkey";

-- AlterTable
ALTER TABLE "cards" ALTER COLUMN "moduleId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "folders" DROP CONSTRAINT "folders_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "folders_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "folders_id_seq";

-- AlterTable
ALTER TABLE "modules" DROP CONSTRAINT "modules_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "folderId" SET DATA TYPE TEXT,
ADD CONSTRAINT "modules_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "modules_id_seq";

-- AlterTable
ALTER TABLE "sentenceUnits" DROP CONSTRAINT "sentenceUnits_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "sentenceUnits_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "sentenceUnits_id_seq";

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "modules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modules" ADD CONSTRAINT "modules_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
