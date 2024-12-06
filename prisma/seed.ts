import { PrismaClient } from '@prisma/client'
import { RegisterDto } from '../src/auth/dto'
import * as argon from 'argon2'
import * as moment from 'moment'

const prisma = new PrismaClient()

async function manualDBSeed() {
  await prisma.cardLearnProgress.updateMany({
    data: {
      step: 0,
      nextRepetitionDate: moment().subtract(2, 'minutes').toDate(),
      threshold: 0.6,
      lastRepetitionDate: moment().subtract(10, 'minutes').toDate(),
      status: 'NEW',
      views: 0,
      consecutiveCorrectAnswers: 0,
    },
    where: {
      card: {
        moduleId: '76f1328a-3284-4698-bb07-d3fee737e394',
      },
    },
  })
}

async function main() {
  const testUserDto: RegisterDto = {
    name: 'Erik',
    email: 'test@mail.com',
    password: '123',
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

  seedData.slice(0, 4).forEach(async (data) => {
    const card = await prisma.card.create({
      data: {
        phraseTranslation: data.phraseTranslation,
        sentenceTranslation: data.sentenceTranslation,
        notes: data.notes,
        sentenceText: data.sentenceText,
        userId: newUser.id,
        moduleId: module.id,
        sentence: {
          create: data.sentence,
        },
      },
    })
    await prisma.cardLearnProgress.create({
      data: {
        cardId: card.id,
      },
    })
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

manualDBSeed()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

const seedData = [
  {
    phraseTranslation: 'идет',
    sentenceTranslation: 'Он идет с собакой',
    notes: '<p>gehen, gign, ist gegangen</p>',
    sentenceText: 'Er geht mit einem Hund',
    sentence: [
      {
        value: 'Er',
        isPunctuation: false,
        isStudyPhrase: false,
      },
      {
        value: 'geht',
        isPunctuation: false,
        isStudyPhrase: true,
      },
      {
        value: 'mit',
        isPunctuation: false,
        isStudyPhrase: false,
      },
      {
        value: 'einem',
        isPunctuation: false,
        isStudyPhrase: false,
      },
      {
        value: 'Hund',
        isPunctuation: false,
        isStudyPhrase: false,
      },
    ],
  },
  {
    phraseTranslation: 'бежит',
    sentenceTranslation: 'Она бежит быстро',
    notes: '<p>laufen, lief, ist gelaufen</p>',
    sentenceText: 'Sie läuft schnell',
    sentence: [
      {
        value: 'Sie',
        isPunctuation: false,
        isStudyPhrase: false,
      },
      {
        value: 'läuft',
        isPunctuation: false,
        isStudyPhrase: true,
      },
      {
        value: 'schnell',
        isPunctuation: false,
        isStudyPhrase: false,
      },
    ],
  },
  {
    phraseTranslation: 'прыгает',
    sentenceTranslation: 'Кот прыгает на стол',
    notes: '<p>springen, sprang, ist gesprungen</p>',
    sentenceText: 'Die Katze springt auf den Tisch',
    sentence: [
      {
        value: 'Die',
        isPunctuation: false,
        isStudyPhrase: false,
      },
      {
        value: 'Katze',
        isPunctuation: false,
        isStudyPhrase: false,
      },
      {
        value: 'springt',
        isPunctuation: false,
        isStudyPhrase: true,
      },
      {
        value: 'auf',
        isPunctuation: false,
        isStudyPhrase: false,
      },
      {
        value: 'den',
        isPunctuation: false,
        isStudyPhrase: false,
      },
      {
        value: 'Tisch',
        isPunctuation: false,
        isStudyPhrase: false,
      },
    ],
  },
  {
    phraseTranslation: 'читает',
    sentenceTranslation: 'Он читает книгу',
    notes: '<p>lesen, las, hat gelesen</p>',
    sentenceText: 'Er liest ein Buch',
    sentence: [
      {
        value: 'Er',
        isPunctuation: false,
        isStudyPhrase: false,
      },
      {
        value: 'liest',
        isPunctuation: false,
        isStudyPhrase: true,
      },
      {
        value: 'ein',
        isPunctuation: false,
        isStudyPhrase: false,
      },
      {
        value: 'Buch',
        isPunctuation: false,
        isStudyPhrase: false,
      },
    ],
  },
  {
    phraseTranslation: 'пишет',
    sentenceTranslation: 'Она пишет письмо',
    notes: '<p>schreiben, schrieb, hat geschrieben</p>',
    sentenceText: 'Sie schreibt einen Brief',
    sentence: [
      {
        value: 'Sie',
        isPunctuation: false,
        isStudyPhrase: false,
      },
      {
        value: 'schreibt',
        isPunctuation: false,
        isStudyPhrase: true,
      },
      {
        value: 'einen',
        isPunctuation: false,
        isStudyPhrase: false,
      },
      {
        value: 'Brief',
        isPunctuation: false,
        isStudyPhrase: false,
      },
    ],
  },
  {
    phraseTranslation: 'говорит',
    sentenceTranslation: 'Он говорит по-немецки',
    notes: '<p>sprechen, sprach, hat gesprochen</p>',
    sentenceText: 'Er spricht Deutsch',
    sentence: [
      {
        value: 'Er',
        isPunctuation: false,
        isStudyPhrase: false,
      },
      {
        value: 'spricht',
        isPunctuation: false,
        isStudyPhrase: true,
      },
      {
        value: 'Deutsch',
        isPunctuation: false,
        isStudyPhrase: false,
      },
    ],
  },
  {
    phraseTranslation: 'слушает',
    sentenceTranslation: 'Она слушает музыку',
    notes: '<p>hören, hörte, hat gehört</p>',
    sentenceText: 'Sie hört Musik',
    sentence: [
      {
        value: 'Sie',
        isPunctuation: false,
        isStudyPhrase: false,
      },
      {
        value: 'hört',
        isPunctuation: false,
        isStudyPhrase: true,
      },
      {
        value: 'Musik',
        isPunctuation: false,
        isStudyPhrase: false,
      },
    ],
  },
  {
    phraseTranslation: 'смотрит',
    sentenceTranslation: 'Он смотрит фильм',
    notes: '<p>sehen, sah, hat gesehen</p>',
    sentenceText: 'Er sieht einen Film',
    sentence: [
      {
        value: 'Er',
        isPunctuation: false,
        isStudyPhrase: false,
      },
      {
        value: 'sieht',
        isPunctuation: false,
        isStudyPhrase: true,
      },
      {
        value: 'einen',
        isPunctuation: false,
        isStudyPhrase: false,
      },
      {
        value: 'Film',
        isPunctuation: false,
        isStudyPhrase: false,
      },
    ],
  },
  {
    phraseTranslation: 'готовит',
    sentenceTranslation: 'Она готовит ужин',
    notes: '<p>kochen, kochte, hat gekocht</p>',
    sentenceText: 'Sie kocht Abendessen',
    sentence: [
      {
        value: 'Sie',
        isPunctuation: false,
        isStudyPhrase: false,
      },
      {
        value: 'kocht',
        isPunctuation: false,
        isStudyPhrase: true,
      },
      {
        value: 'Abendessen',
        isPunctuation: false,
        isStudyPhrase: false,
      },
    ],
  },
  {
    phraseTranslation: 'плавает',
    sentenceTranslation: 'Он плавает в бассейне',
    notes: '<p>schwimmen, schwamm, ist geschwommen</p>',
    sentenceText: 'Er schwimmt im Schwimmbad',
    sentence: [
      {
        value: 'Er',
        isPunctuation: false,
        isStudyPhrase: false,
      },
      {
        value: 'schwimmt',
        isPunctuation: false,
        isStudyPhrase: true,
      },
      {
        value: 'im',
        isPunctuation: false,
        isStudyPhrase: false,
      },
      {
        value: 'Schwimmbad',
        isPunctuation: false,
        isStudyPhrase: false,
      },
    ],
  },
  {
    phraseTranslation: 'танцует',
    sentenceTranslation: 'Она танцует на вечеринке',
    notes: '<p>tanzen, tanzte, hat getanzt</p>',
    sentenceText: 'Sie tanzt auf der Party',
    sentence: [
      {
        value: 'Sie',
        isPunctuation: false,
        isStudyPhrase: false,
      },
      {
        value: 'tanzt',
        isPunctuation: false,
        isStudyPhrase: true,
      },
      {
        value: 'auf',
        isPunctuation: false,
        isStudyPhrase: false,
      },
      {
        value: 'der',
        isPunctuation: false,
        isStudyPhrase: false,
      },
      {
        value: 'Party',
        isPunctuation: false,
        isStudyPhrase: false,
      },
    ],
  },
]
