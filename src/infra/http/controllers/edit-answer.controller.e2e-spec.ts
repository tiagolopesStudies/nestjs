import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/make-answer'
import { AnswerAttachmentFactory } from 'test/factories/make-answer-attachment'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Edit answer (e2e)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory
  let attachmentFactory: AttachmentFactory
  let answerAttachmentFactory: AnswerAttachmentFactory
  let jwt: JwtService
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        AnswerFactory,
        AnswerAttachmentFactory
      ]
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    answerAttachmentFactory = moduleRef.get(AnswerAttachmentFactory)

    await app.init()
  })

  test('PUT /answers/:id', async () => {
    const user = await studentFactory.makePrismaStudent()
    const accessToken = await jwt.signAsync({ sub: user.id.toString() })

    const attachment1 = await attachmentFactory.makePrismaAttachment()
    const attachment2 = await attachmentFactory.makePrismaAttachment()
    const attachment3 = await attachmentFactory.makePrismaAttachment()

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id
    })

    const answer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id
    })

    await answerAttachmentFactory.makePrismaAnswerAttachment({
      attachmentId: attachment1.id,
      answerId: answer.id
    })

    await answerAttachmentFactory.makePrismaAnswerAttachment({
      attachmentId: attachment2.id,
      answerId: answer.id
    })

    const response = await request(app.getHttpServer())
      .put(`/answers/${answer.id.toString()}`)
      .set({
        Authorization: `Bearer ${accessToken}`
      })
      .send({
        content: 'Este é o conteúdo da minha resposta.',
        attachments: [attachment1.id.toString(), attachment3.id.toString()]
      })

    expect(response.status).toBe(204)

    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        answerId: answer.id.toString()
      }
    })

    expect(attachmentsOnDatabase).toHaveLength(2)
    expect(attachmentsOnDatabase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: attachment1.id.toString()
        }),
        expect.objectContaining({
          id: attachment3.id.toString()
        })
      ])
    )
  })
})
