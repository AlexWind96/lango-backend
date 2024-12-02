import { CardEntity } from '../../cards/entities/card.entity'
import { LEARN_STATUS } from '@prisma/client'

export const getCountsByProgress = (cards: Pick<CardEntity, 'progress'>[]) => {
  return {
    all: cards.length,
    new: cards.filter((card) => card.progress?.status === LEARN_STATUS.NEW)
      .length,
    shown: cards.filter((card) => card.progress?.status === LEARN_STATUS.SHOWN)
      .length,
    in_progress: cards.filter(
      (card) => card.progress?.status === LEARN_STATUS.IN_PROGRESS,
    ).length,
    in_familiar: cards.filter(
      (card) => card.progress?.status === LEARN_STATUS.FAMILIAR,
    ).length,
    known: cards.filter((card) => card.progress?.status === LEARN_STATUS.KNOWN)
      .length,
  }
}
