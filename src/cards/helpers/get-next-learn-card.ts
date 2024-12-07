import * as moment from 'moment'
import { CardEntity } from '../entities/card.entity'

export const getStabilityRatio = (
  step: number,
  growthRation: number,
  initialMemoryPersistence: number,
): number => {
  return initialMemoryPersistence * (1 + growthRation) ** step
}

export const getInterval = (
  stabilityRation: number,
  threshold: number,
): number => {
  return Math.round(-stabilityRation * Math.log(threshold))
}

const getIntervalValues = (cards: Partial<CardEntity>[]) => {
  const now = moment()
  return cards.map((card) => {
    if (card.progress.nextRepetitionDate) {
      const nextRepetitionDate = moment(card.progress.nextRepetitionDate)
      return {
        id: card.id,
        interval: moment
          .duration(nextRepetitionDate.diff(now))
          .asMilliseconds(),
        step: card.progress.step,
        isExpired: card.progress.nextRepetitionDate < now.toDate(),
      }
    } else {
      const nextRepetitionDate = moment(card.createdAt)
      return {
        id: card.id,
        interval: moment
          .duration(nextRepetitionDate.diff(now))
          .asMilliseconds(),
        step: card.progress.step,
        isExpired: true,
      }
    }
  })
}

export const getLearnCard = (cards: CardEntity[]): CardEntity | null => {
  const expiredCards = getIntervalValues(cards).filter((card) => card.isExpired)
  const sortedExpiredCards = expiredCards.sort((a, b) => a.step - b.step)

  const card = cards.find((card) => card.id === sortedExpiredCards[0]?.id)

  return card ? card : null
}

export const getExpiredCardsCount = (cards: Partial<CardEntity>[]): number => {
  const expiredCards = getIntervalValues(cards).filter((card) => card.isExpired)
  return expiredCards.length
}

export const getNextLearnCard = (cards: CardEntity[]): CardEntity | null => {
  const expiredCards = getIntervalValues(cards).filter((card) => card.isExpired)
  const sortedExpiredCards = expiredCards.sort((a, b) => {
    if (a.step === b.step) {
      return b.interval - a.interval
    }
    return a.step - b.step
  })

  const card = cards.find((card) => card.id === sortedExpiredCards[1]?.id)

  return card ? card : null
}
