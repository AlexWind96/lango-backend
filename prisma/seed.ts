import { PrismaClient } from '@prisma/client'
import { RegisterDto } from '../src/auth/dto'
import * as argon from 'argon2'

const prisma = new PrismaClient()

async function main() {
  const testUserDto: RegisterDto = {
    name: 'Erik',
    email: 'tesusert@mail.com',
    password: 's3cret',
  }
  const hash = await argon.hash(testUserDto.password)
  const newUser = await prisma.user.create({
    data: {
      email: testUserDto.email,
      hash: hash,
      name: testUserDto.name,
    },
  })

  const module = await prisma.module.create({
    data: {
      userId: newUser.id,
      label: 'Module',
    },
  })

  const card = await prisma.card.create({
    data: {
      phraseTranslation: 'идет',
      sentenceTranslation: 'Он идет с собакой',
      notes: '<p>gehen, gign, ist gegangen</p>',
      sentenceText: 'Er geht mit einem Hund',
      userId: newUser.id,
      moduleId: module.id,
      sentence: {
        create: [
          { value: 'Er', isPunctuation: false, isStudyPhrase: false },
          {
            value: 'geht',
            isPunctuation: false,
            isStudyPhrase: true,
          },
          { value: 'mit', isPunctuation: false, isStudyPhrase: false },
          {
            value: 'einem',
            isPunctuation: false,
            isStudyPhrase: false,
          },
          { value: 'Hund', isPunctuation: false, isStudyPhrase: false },
        ],
      },
    },
  })
  await prisma.cardLearnProgress.create({
    data: {
      cardId: card.id,
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
