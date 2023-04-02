import { LEARN_STATUS } from '@prisma/client'
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
        return moment(card.progress.nextRepetitionDate).isSameOrAfter(
          learnSessionDate,
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
        return moment(card.progress.nextRepetitionDate).isSameOrAfter(
          learnSessionDate,
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
        return moment(card.progress.nextRepetitionDate).isSameOrAfter(
          learnSessionDate,
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

const getRandom = <Item>(items: Item[]): Item => {
  return items[Math.floor(Math.random() * items.length)]
}

export const getNextLearnCard = (
  cards: CardEntity[],
  learningSessionData: Date,
): CardEntity | null => {
  const notNewCards = getNotNewCards(cards)

  const expiredShownCards = getExpiredShownCards(notNewCards)

  if (expiredShownCards.length) {
    return getRandom(expiredShownCards)
  }

  const expiredFamiliarCards = getExpiredFamiliarCards(
    notNewCards,
    learningSessionData,
  )

  if (expiredFamiliarCards.length) {
    return getCardWithMinimalAccuracy(expiredFamiliarCards)
  }

  const expiredInProgressCards = getExpiredInProgressCards(
    notNewCards,
    learningSessionData,
  )
  if (expiredInProgressCards.length) {
    return getCardWithMinimalAccuracy(expiredInProgressCards)
  }

  const expiredKnownCards = getExpiredKnownCards(
    notNewCards,
    learningSessionData,
  )
  if (expiredKnownCards.length) {
    return getCardWithMinimalAccuracy(expiredKnownCards)
  }

  const newCards = getNewCards(cards)
  const randomCard = getRandom(newCards)
  return randomCard ? randomCard : null
}
