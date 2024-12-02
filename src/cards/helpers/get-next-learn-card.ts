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
      if (card.progress.step > 1) {
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
      if (card.progress.step > 1) {
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
      if (card.progress.step > 1) {
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

const getCardWithMinimalViews = (cards: CardEntity[]): CardEntity | null => {
  if (cards.length === 0) return null
  return cards.reduce((acc, current) => {
    return acc.progress.views < current.progress.views ? acc : current
  })
}

const getRandomCardFromArray = <Item>(items: Item[]): Item | null => {
  if (items.length) {
    return items[Math.floor(Math.random() * items.length)]
  } else return null
}

const getRandom = () => Math.floor(Math.random() * 10)
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min
export const getNextLearnCard = (
  cards: CardEntity[],
  learningSessionDate: CurrentLearnSession,
): CardEntity | null => {
  const { createdAt: sessionDate } = learningSessionDate
  const random = randomInt(0, 9)
  //1. Get New card with chance 10%
  const newCards = getNewCards(cards)
  const randomNewCard = getRandomCardFromArray(newCards)
  if (random === 0 && randomNewCard) {
    return randomNewCard
  }
  //1. Get unknown card with chance 10%
  if (random === 0) {
    const notNewCard = getNotNewCard(
      cards.filter((card) => card.progress.complexity === 'UNKNOWN'),
      sessionDate,
    )
    if (notNewCard) {
      return notNewCard
    }
  }
  //1. Get easy card with chance 20%
  if (random > 0 && random < 3) {
    const notNewCard = getNotNewCard(
      cards.filter((card) => card.progress.complexity === 'EASY'),
      sessionDate,
    )
    if (notNewCard) {
      return notNewCard
    }
  }
  //1. Get medium card with chance 30%
  if (random >= 3 && random < 6) {
    const notNewCard = getNotNewCard(
      cards.filter((card) => card.progress.complexity === 'MEDIUM'),
      sessionDate,
    )
    if (notNewCard) {
      return notNewCard
    }
  }
  //1. Get hard card with chance 40%
  if (random >= 6) {
    const notNewCard = getNotNewCard(
      cards.filter((card) => card.progress.complexity === 'HARD'),
      sessionDate,
    )
    if (notNewCard) {
      return notNewCard
    }
  }
  //6. Get new card
  return randomNewCard ? randomNewCard : null
}

const getNotNewCard = (
  cards: CardEntity[],
  sessionDate: Date,
): CardEntity | null => {
  const notNewCards = getNotNewCards(cards)

  const randomShownCard = getRandomCardFromArray(
    getExpiredShownCards(notNewCards),
  )

  if (randomShownCard) {
    return randomShownCard
  }

  //3. Get familiar card with minimal accuracy
  const randomFamiliarCard = getCardWithMinimalViews(
    getExpiredFamiliarCards(notNewCards, sessionDate),
  )

  if (randomFamiliarCard) {
    return randomFamiliarCard
  }
  //4. Get in progress card with minimal accuracy
  const randomInProgressCard = getCardWithMinimalViews(
    getExpiredInProgressCards(notNewCards, sessionDate),
  )

  if (randomInProgressCard) {
    return randomInProgressCard
  }
  //5. Get known card with minimal accuracy
  const knownCard = getCardWithMinimalViews(
    getExpiredKnownCards(notNewCards, sessionDate),
  )
  if (knownCard) {
    return knownCard
  }
  return null
}
