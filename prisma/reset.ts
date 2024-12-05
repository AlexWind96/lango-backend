import { PrismaClient } from '@prisma/client'
import { RegisterDto } from '../src/auth/dto'
import * as argon from 'argon2'
import moment from 'moment'

const prisma = new PrismaClient()

async function main() {
  await prisma.cardLearnProgress.updateMany({
    data: {
      step: 0,
      nextRepetitionDate: moment().add(1, 'day').toDate(),
      threshold: 0.6,
      lastRepetitionDate: moment().toDate(),
      status: 'NEW',
      views: 0,
      consecutiveCorrectAnswers: 0,
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
