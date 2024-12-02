import { CardLearnProgressEntity } from '../entities/card-progress.entity'
import { COMPLEXITY, LEARN_STATUS } from '@prisma/client'
import * as moment from 'moment'

const getNextDay = (days: number) => {
  return moment().utc().add(days, 'day').startOf('day').toDate()
}

const getNextTime = (min: number) => {
  return moment().utc().add(min, 'm').toDate()
}

const getNextIntervalDate = (step: number) => {
  switch (step) {
    case 0: {
      return getNextTime(5)
    }
    case 1: {
      return getNextTime(25)
    }
    case 2: {
      return getNextDay(1)
    }
    case 3: {
      return getNextDay(5)
    }
    case 4: {
      return getNextDay(10)
    }
    case 5: {
      return getNextDay(20)
    }
    case 6: {
      return getNextDay(30)
    }
    case 7: {
      return getNextDay(60)
    }
    default: {
      return getNextDay(60)
    }
  }
}

const getComplexity = (cardProgress: CardLearnProgressEntity): COMPLEXITY => {
  return 'UNKNOWN'
}

const getStatus = (step: number): LEARN_STATUS => {
  switch (step) {
    case 0: {
      return 'NEW'
    }
    case 1: {
      return 'SHOWN'
    }
    case 2: {
      return 'IN_PROGRESS'
    }
    case 3: {
      return 'IN_PROGRESS'
    }
    case 4: {
      return 'FAMILIAR'
    }
    case 5: {
      return 'FAMILIAR'
    }
    case 6: {
      return 'KNOWN'
    }
    case 7: {
      return 'KNOWN'
    }
    default: {
      return 'KNOWN'
    }
  }
}

export const changeCardProgressPositive = (
  cardProgress: CardLearnProgressEntity,
): Partial<CardLearnProgressEntity> => {
  const nextStep = cardProgress.step + 1
  return {
    status: LEARN_STATUS.KNOWN,
    step: nextStep,
    nextRepetitionDate: getNextIntervalDate(nextStep),
  }
}

export const changeCardProgressNegative = (
  cardProgress: CardLearnProgressEntity,
): Partial<CardLearnProgressEntity> => {
  return {
    status: LEARN_STATUS.SHOWN,
    step: cardProgress.step - 1,
    nextRepetitionDate: getNextIntervalDate(cardProgress.step - 1),
  }
}

export const changeCardProgressNeutral = (
  cardProgress: CardLearnProgressEntity,
): Partial<CardLearnProgressEntity> => {
  return {
    status: cardProgress.status,
    step: cardProgress.step,
    nextRepetitionDate: getNextIntervalDate(cardProgress.step),
  }
}
