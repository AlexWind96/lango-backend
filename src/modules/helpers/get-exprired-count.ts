import * as moment from 'moment'
import { CardEntity } from '../../cards/entities/card.entity'

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

const getIntervalValues = (cards: CardEntity[]) => {
  const now = moment()
  return cards.map((card) => {
    if (card.progress.nextRepetitionDate) {
      const nextRepetitionDate = moment(card.progress.nextRepetitionDate)
      return {
        id: card.id,
        interval: moment
          .duration(nextRepetitionDate.diff(now))
          .asMilliseconds(),
        isExpired: card.progress.nextRepetitionDate < now.toDate(),
      }
    } else {
      const nextRepetitionDate = moment(card.createdAt)
      return {
        id: card.id,
        interval: moment
          .duration(nextRepetitionDate.diff(now))
          .asMilliseconds(),
        isExpired: true,
      }
    }
  })
}

export const getExpiredCardsCount = (cards: CardEntity[]): number => {
  const expiredCards = getIntervalValues(cards).filter((card) => card.isExpired)
  return expiredCards.length
}
