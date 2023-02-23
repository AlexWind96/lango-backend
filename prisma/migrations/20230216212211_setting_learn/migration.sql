-- CreateEnum
CREATE TYPE "LEARN_STATUS" AS ENUM ('NEW', 'SHOWN', 'IN_PROGRESS', 'FAMILIAR', 'KNOWN');

-- AlterTable
ALTER TABLE "cards" ALTER COLUMN "sentenceTranslation" DROP NOT NULL;

-- CreateTable
CREATE TABLE "CardLearnProgress" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "interval" INTEGER NOT NULL DEFAULT 0,
    "accuracy" INTEGER NOT NULL DEFAULT 100,
    "status" "LEARN_STATUS" NOT NULL DEFAULT 'NEW',
    "lastRepetitionDate" TIMESTAMP(3),
    "nextRepetitionDate" TIMESTAMP(3),

    CONSTRAINT "CardLearnProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "goal" INTEGER NOT NULL DEFAULT 50,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearnSession" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "completed" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "LearnSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CardLearnProgress_cardId_key" ON "CardLearnProgress"("cardId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_userId_key" ON "UserSettings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LearnSession_userId_key" ON "LearnSession"("userId");

-- AddForeignKey
ALTER TABLE "CardLearnProgress" ADD CONSTRAINT "CardLearnProgress_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearnSession" ADD CONSTRAINT "LearnSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
