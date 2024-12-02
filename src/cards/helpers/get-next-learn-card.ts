import { CurrentLearnSession, LEARN_STATUS } from '@prisma/client'
import * as moment from 'moment'
import { CardEntity } from '../entities/card.entity'

const getNotNewCards = (cards: CardEntity[]): CardEntity[] => {
  return cards.filter((card) => card.progress.status !== LEARN_STATUS.NEW)
}
const getNewCards = (cards: CardEntity[]): CardEntity[] => {
  return cards.filter((card) => card.progress.status === LEARN_STATUS.NEW)
}

const getExpiredShownCards = (cards: CardEntity[]): CardEntity[] => {
  return cards
    .filter((card) => card.progress.status === LEARN_STATUS.SHOWN)
    .filter((card) => {
      return card.progress.nextRepetitionDate < moment().toDate()
    })
}

const getExpiredFamiliarCards = (
  cards: CardEntity[],
  learnSessionDate: Date,
): CardEntity[] => {
  return cards
    .filter((card) => card.progress.status === LEARN_STATUS.FAMILIAR)
    .filter((card) => {
      if (card.progress.interval > 1) {
        return moment(learnSessionDate).isSameOrAfter(
          card.progress.nextRepetitionDate,
          'day',
        )
      } else {
        return (
          moment(card.progress.nextRepetitionDate).toDate() < moment().toDate()
        )
      }
    })
}

const getExpiredInProgressCards = (
  cards: CardEntity[],
  learnSessionDate: Date,
): CardEntity[] => {
  return cards
    .filter((card) => card.progress.status === LEARN_STATUS.IN_PROGRESS)
    .filter((card) => {
      if (card.progress.interval > 1) {
        return moment(learnSessionDate).isSameOrAfter(
          card.progress.nextRepetitionDate,
          'day',
        )
      } else {
        return (
          moment(card.progress.nextRepetitionDate).toDate() < moment().toDate()
        )
      }
    })
}

const getExpiredKnownCards = (
  cards: CardEntity[],
  learnSessionDate: Date,
): CardEntity[] => {
  return cards
    .filter((card) => card.progress.status === LEARN_STATUS.KNOWN)
    .filter((card) => {
      if (card.progress.interval > 1) {
        return moment(learnSessionDate).isSameOrAfter(
          card.progress.nextRepetitionDate,
          'day',
        )
      } else {
        return (
          moment(card.progress.nextRepetitionDate).toDate() < moment().toDate()
        )
      }
    })
}

const getCardWithMinimalAccuracy = (cards: CardEntity[]): CardEntity | null => {
  if (cards.length === 0) return null
  return cards.reduce((acc, current) => {
    return acc.progress.accuracy < current.progress.accuracy ? acc : current
  })
}

const getRandomCardFromArray = <Item>(items: Item[]): Item | null => {
  if (items.length) {
    return items[Math.floor(Math.random() * items.length)]
  } else return null
}

const getRandom = () => Math.floor(Math.random() * 10)

export const getNextLearnCard = (
  cards: CardEntity[],
  learningSessionDate: CurrentLearnSession,
): CardEntity | null => {
  const { createdAt: sessionDate } = learningSessionDate

  //1. Get New card with chance 10%
  const random = getRandom()
  const newCards = getNewCards(cards)
  const randomNewCard = getRandomCardFromArray(newCards)
  if (random === 1 && randomNewCard) {
    return randomNewCard
  }

  //2. Get random shown card
  const notNewCards = getNotNewCards(cards)

  const randomShownCard = getRandomCardFromArray(
    getExpiredShownCards(notNewCards),
  )

  if (randomShownCard) {
    return randomShownCard
  }

  //3. Get familiar card with minimal accuracy
  const randomFamiliarCard = getCardWithMinimalAccuracy(
    getExpiredFamiliarCards(notNewCards, sessionDate),
  )

  if (randomFamiliarCard) {
    return randomFamiliarCard
  }
  //4. Get in progress card with minimal accuracy
  const randomInProgressCard = getCardWithMinimalAccuracy(
    getExpiredInProgressCards(notNewCards, sessionDate),
  )

  if (randomInProgressCard) {
    return randomInProgressCard
  }
  //5. Get known card with minimal accuracy
  const knownCard = getCardWithMinimalAccuracy(
    getExpiredKnownCards(notNewCards, sessionDate),
  )
  if (knownCard) {
    return knownCard
  }

  //6. Get new card
  return randomNewCard ? randomNewCard : null
}
