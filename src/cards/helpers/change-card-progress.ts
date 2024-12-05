import { CardLearnProgressEntity } from '../entities/card-progress.entity'
import { LEARN_STATUS, User } from '@prisma/client'
import * as moment from 'moment'
import { getInterval, getStabilityRatio } from './get-next-learn-card'

const calculateProgress = (
  step: number,
  stepInterval: number,
  status: LEARN_STATUS,
  user: User,
  threshold: number,
  consecutiveCorrectAnswers?: number,
): Partial<CardLearnProgressEntity> => {
  const stabilityRatio = getStabilityRatio(
    stepInterval,
    user.growthRatio,
    user.initialMemoryPersistence,
  )
  const interval = getInterval(stabilityRatio, threshold)
  const nextRepetitionDate = moment()
    .add(interval, status === LEARN_STATUS.SHOWN ? 'seconds' : 'days')
    .toDate()

  return {
    status,
    step,
    threshold,
    lastRepetitionDate: moment().toDate(),
    nextRepetitionDate,
    consecutiveCorrectAnswers,
  }
}

const getDecreasedThreshold = (threshold: number): number => {
  const nextThreshold = Math.round((threshold - 0.1) * 10) / 10
  return nextThreshold > 0.3 ? nextThreshold : 0.4
}

export const changeCardProgressPositive = (
  cardProgress: CardLearnProgressEntity,
  user: User,
): Partial<CardLearnProgressEntity> => {
  const { status, step, threshold, consecutiveCorrectAnswers } = cardProgress
  const newThreshold =
    consecutiveCorrectAnswers > 1 ? getDecreasedThreshold(threshold) : threshold
  const stepAlias = status !== 'KNOWN' ? `${status}-${step}` : 'KNOWN'
  switch (stepAlias) {
    case 'NEW-0':
      return calculateProgress(
        2,
        3,
        LEARN_STATUS.SHOWN,
        user,
        newThreshold,
        cardProgress.consecutiveCorrectAnswers,
      )
    case 'SHOWN-1':
      return calculateProgress(
        2,
        4,
        LEARN_STATUS.SHOWN,
        user,
        newThreshold,
        cardProgress.consecutiveCorrectAnswers,
      )
    case 'SHOWN-2':
      return calculateProgress(
        3,
        0,
        LEARN_STATUS.IN_PROGRESS,
        user,
        newThreshold,
        cardProgress.consecutiveCorrectAnswers,
      )
    case 'IN_PROGRESS-3':
      return calculateProgress(
        4,
        1,
        LEARN_STATUS.IN_PROGRESS,
        user,
        newThreshold,
        cardProgress.consecutiveCorrectAnswers + 1,
      )
    case 'IN_PROGRESS-4':
      return calculateProgress(
        5,
        2,
        LEARN_STATUS.FAMILIAR,
        user,
        newThreshold,
        cardProgress.consecutiveCorrectAnswers + 1,
      )
    case 'FAMILIAR-5':
      return calculateProgress(
        6,
        3,
        LEARN_STATUS.FAMILIAR,
        user,
        newThreshold,
        cardProgress.consecutiveCorrectAnswers + 1,
      )
    case 'FAMILIAR-6':
      return calculateProgress(
        7,
        4,
        LEARN_STATUS.KNOWN,
        user,
        newThreshold,
        cardProgress.consecutiveCorrectAnswers + 1,
      )
    case 'KNOWN':
      return calculateProgress(
        cardProgress.step + 1,
        cardProgress.step - 1 > 0 ? cardProgress.step - 1 : 2,
        LEARN_STATUS.KNOWN,
        user,
        newThreshold,
        cardProgress.consecutiveCorrectAnswers + 1,
      )
  }
}

const getIncreasedThreshold = (threshold: number): number => {
  const nextThreshold = Math.round((threshold + 0.1) * 10) / 10
  return nextThreshold < 1 ? nextThreshold : 0.9
}

export const changeCardProgressNegative = (
  cardProgress: CardLearnProgressEntity,
  user: User,
): Partial<CardLearnProgressEntity> => {
  const { status, step } = cardProgress
  const newThreshold = getIncreasedThreshold(cardProgress.threshold)
  const stepAlias = status !== 'KNOWN' ? `${status}-${step}` : 'KNOWN'
  switch (stepAlias) {
    case 'NEW-0':
      return calculateProgress(
        1,
        1,
        LEARN_STATUS.SHOWN,
        user,
        cardProgress.threshold,
        0,
      )
    case 'SHOWN-1':
      return calculateProgress(
        2,
        2,
        LEARN_STATUS.SHOWN,
        user,
        cardProgress.threshold,
        0,
      )
    case 'SHOWN-2':
      return calculateProgress(
        2,
        2,
        LEARN_STATUS.SHOWN,
        user,
        cardProgress.threshold,
        0,
      )
    case 'IN_PROGRESS-3':
      return calculateProgress(
        3,
        0,
        LEARN_STATUS.IN_PROGRESS,
        user,
        newThreshold,
        0,
      )
    case 'IN_PROGRESS-4':
      return calculateProgress(
        3,
        0,
        LEARN_STATUS.IN_PROGRESS,
        user,
        newThreshold,
        0,
      )
    case 'FAMILIAR-5':
      return calculateProgress(
        5,
        2,
        LEARN_STATUS.FAMILIAR,
        user,
        newThreshold,
        0,
      )
    case 'FAMILIAR-6':
      return calculateProgress(
        6,
        2,
        LEARN_STATUS.FAMILIAR,
        user,
        newThreshold,
        0,
      )
    case 'KNOWN':
      return calculateProgress(
        cardProgress.step,
        cardProgress.step - 2 > 0 ? cardProgress.step - 2 : 1,
        LEARN_STATUS.KNOWN,
        user,
        newThreshold,
        0,
      )
  }
}
