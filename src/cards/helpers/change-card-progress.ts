import { CardLearnProgressEntity } from '../entities/card-progress.entity'
import { LEARN_STATUS } from '@prisma/client'
import * as moment from 'moment'

const getAccuracy = (
  cardProgress: CardLearnProgressEntity,
  isAnswerRight: boolean,
) => {
  if (isAnswerRight) {
    return Math.round(
      ((cardProgress.countOfRightAnswers + 1) /
        (cardProgress.countOfAnswers + 1)) *
        100,
    )
  } else {
    return Math.round(
      (cardProgress.countOfRightAnswers / (cardProgress.countOfAnswers + 1)) *
        100,
    )
  }
}

const getNextDay = (days: number) => {
  return moment().utc().add(days, 'day').startOf('day').toDate()
}

const getNextTime = (min: number) => {
  return moment().utc().add(min, 'm').toDate()
}

const getNextIntervalDate = (interval: number) => {
  switch (interval) {
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

const isFamiliar = (cardProgress: CardLearnProgressEntity): boolean => {
  const nextInterval = cardProgress.interval + 1
  const nextAccuracy = getAccuracy(cardProgress, true)
  return (nextAccuracy >= 80 && nextInterval >= 4) || nextInterval >= 5
}

const isInProgress = (cardProgress: CardLearnProgressEntity): boolean => {
  const nextInterval = cardProgress.interval + 1
  const nextAccuracy = getAccuracy(cardProgress, true)
  return (nextAccuracy >= 60 && nextInterval >= 2) || nextInterval >= 3
}

export const changeCardProgressPositive = (
  cardProgress: CardLearnProgressEntity,
): Partial<CardLearnProgressEntity> => {
  switch (cardProgress.status) {
    case LEARN_STATUS.NEW: {
      return {
        status: LEARN_STATUS.SHOWN,
        interval: 0,
        step: 2,
        accuracy: 100,
        countOfRightAnswers: 1,
        countOfAnswers: 1,
        lastRepetitionDate: moment().toDate(),
        nextRepetitionDate: getNextIntervalDate(0),
      }
    }
    case LEARN_STATUS.SHOWN: {
      return {
        status: isInProgress(cardProgress)
          ? LEARN_STATUS.IN_PROGRESS
          : LEARN_STATUS.SHOWN,
        interval: cardProgress.interval + 1,
        step: isInProgress(cardProgress) ? 3 : 2,
        accuracy: getAccuracy(cardProgress, true),
        countOfRightAnswers: cardProgress.countOfRightAnswers + 1,
        countOfAnswers: cardProgress.countOfAnswers + 1,
        lastRepetitionDate: moment().toDate(),
        nextRepetitionDate: getNextIntervalDate(cardProgress.interval + 1),
      }
    }
    case LEARN_STATUS.IN_PROGRESS: {
      return {
        status: isFamiliar(cardProgress)
          ? LEARN_STATUS.FAMILIAR
          : LEARN_STATUS.IN_PROGRESS,
        interval: cardProgress.interval + 1,
        step: isFamiliar(cardProgress) ? 4 : 3,
        accuracy: getAccuracy(cardProgress, true),
        countOfRightAnswers: cardProgress.countOfRightAnswers + 1,
        countOfAnswers: cardProgress.countOfAnswers + 1,
        lastRepetitionDate: moment().toDate(),
        nextRepetitionDate: getNextIntervalDate(cardProgress.interval + 1),
      }
    }
    case LEARN_STATUS.FAMILIAR: {
      return {
        status: LEARN_STATUS.KNOWN,
        interval: cardProgress.interval + 1,
        step: 5,
        accuracy: getAccuracy(cardProgress, true),
        countOfRightAnswers: cardProgress.countOfRightAnswers + 1,
        countOfAnswers: cardProgress.countOfAnswers + 1,
        lastRepetitionDate: moment().toDate(),
        nextRepetitionDate: getNextIntervalDate(cardProgress.interval + 1),
      }
    }
    case LEARN_STATUS.KNOWN: {
      return {
        status: LEARN_STATUS.KNOWN,
        interval: cardProgress.interval + 1,
        step: 5,
        accuracy: getAccuracy(cardProgress, true),
        countOfRightAnswers: cardProgress.countOfRightAnswers + 1,
        countOfAnswers: cardProgress.countOfAnswers + 1,
        lastRepetitionDate: moment().toDate(),
        nextRepetitionDate: getNextIntervalDate(cardProgress.interval + 1),
      }
    }
  }
}

const isShown = ({ accuracy, interval }: CardLearnProgressEntity): boolean => {
  return (accuracy < 60 && interval === 1) || interval <= 2
}
export const changeCardProgressNegative = (
  cardProgress: CardLearnProgressEntity,
): Partial<CardLearnProgressEntity> => {
  switch (cardProgress.status) {
    case LEARN_STATUS.NEW: {
      //Регистрируем как правильный ответ
      return {
        status: LEARN_STATUS.SHOWN,
        interval: 0,
        step: 2,
        accuracy: 100,
        countOfRightAnswers: 1,
        countOfAnswers: 1,
        lastRepetitionDate: moment().toDate(),
        nextRepetitionDate: getNextIntervalDate(0),
      }
    }
    case LEARN_STATUS.SHOWN: {
      return {
        status: LEARN_STATUS.SHOWN,
        interval: cardProgress.interval - 1,
        step: 2,
        accuracy: getAccuracy(cardProgress, false),
        countOfRightAnswers: cardProgress.countOfRightAnswers,
        countOfAnswers: cardProgress.countOfAnswers + 1,
        lastRepetitionDate: moment().toDate(),
        nextRepetitionDate: getNextIntervalDate(cardProgress.interval - 1),
      }
    }
    case LEARN_STATUS.IN_PROGRESS: {
      return {
        status: isShown(cardProgress)
          ? LEARN_STATUS.SHOWN
          : LEARN_STATUS.IN_PROGRESS,
        interval: cardProgress.interval - 1,
        step: isShown(cardProgress) ? 2 : 3,
        accuracy: getAccuracy(cardProgress, false),
        countOfRightAnswers: cardProgress.countOfRightAnswers,
        countOfAnswers: cardProgress.countOfAnswers + 1,
        lastRepetitionDate: moment().toDate(),
        nextRepetitionDate: getNextIntervalDate(cardProgress.interval - 1),
      }
    }
    case LEARN_STATUS.FAMILIAR: {
      return {
        status: LEARN_STATUS.IN_PROGRESS,
        interval: 2,
        step: 3,
        accuracy: getAccuracy(cardProgress, false),
        countOfRightAnswers: cardProgress.countOfRightAnswers,
        countOfAnswers: cardProgress.countOfAnswers + 1,
        lastRepetitionDate: moment().toDate(),
        nextRepetitionDate: getNextIntervalDate(2),
      }
    }
    case LEARN_STATUS.KNOWN: {
      return {
        status: LEARN_STATUS.IN_PROGRESS,
        interval: 2,
        step: 3,
        accuracy: getAccuracy(cardProgress, false),
        countOfRightAnswers: cardProgress.countOfRightAnswers,
        countOfAnswers: cardProgress.countOfAnswers + 1,
        lastRepetitionDate: moment().toDate(),
        nextRepetitionDate: getNextIntervalDate(2),
      }
    }
  }
}
