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

const getRandomCardFromArray = <Item>(items: Item[]): Item => {
  return items[Math.floor(Math.random() * items.length)]
}

const getRandomZeroOrOne = () => Math.floor(Math.random() * 2)

export const getNextLearnCard = (
  cards: CardEntity[],
  learningSessionDate: CurrentLearnSession,
): CardEntity | null => {
  const notNewCards = getNotNewCards(cards)

  const expiredShownCards = getExpiredShownCards(notNewCards)

  if (expiredShownCards.length) {
    return getRandomCardFromArray(expiredShownCards)
  }

  const expiredFamiliarCards = getExpiredFamiliarCards(
    notNewCards,
    learningSessionDate.createdAt,
  )

  if (expiredFamiliarCards.length) {
    return getCardWithMinimalAccuracy(expiredFamiliarCards)
  }

  const expiredInProgressCards = getExpiredInProgressCards(
    notNewCards,
    learningSessionDate.createdAt,
  )
  if (expiredInProgressCards.length) {
    return getCardWithMinimalAccuracy(expiredInProgressCards)
  }

  const random = getRandomZeroOrOne()
  if (random === 0) {
    const expiredKnownCards = getExpiredKnownCards(
      notNewCards,
      learningSessionDate.createdAt,
    )
    if (expiredKnownCards.length) {
      return getCardWithMinimalAccuracy(expiredKnownCards)
    }
  } else {
    const newCards = getNewCards(cards)
    const randomCard = getRandomCardFromArray(newCards)
    return randomCard ? randomCard : null
  }

  return null
}
