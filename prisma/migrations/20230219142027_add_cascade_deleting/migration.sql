-- DropForeignKey
ALTER TABLE "CardLearnProgress" DROP CONSTRAINT "CardLearnProgress_cardId_fkey";

-- DropForeignKey
ALTER TABLE "cards" DROP CONSTRAINT "cards_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "sentenceUnits" DROP CONSTRAINT "sentenceUnits_cardId_fkey";

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sentenceUnits" ADD CONSTRAINT "sentenceUnits_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardLearnProgress" ADD CONSTRAINT "CardLearnProgress_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
