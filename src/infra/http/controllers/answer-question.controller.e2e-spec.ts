import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Answer Question (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let attachmentFactory: AttachmentFactory
  let questionFactory: QuestionFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, AttachmentFactory, QuestionFactory]
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    questionFactory = moduleRef.get(QuestionFactory)

    await app.init()
  })

  it('POST /questions/{questionId}/answers', async () => {
    const user = await studentFactory.makePrismaStudent()
    const accessToken = await jwt.signAsync({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id
    })
    const firstAttachment = await attachmentFactory.makePrismaAttachment()
    const secondAttachment = await attachmentFactory.makePrismaAttachment()

    const response = await request(app.getHttpServer())
      .post(`/questions/${question.id.toString()}/answers`)
      .send({
        content: 'Answer content',
        attachments: [
          firstAttachment.id.toString(),
          secondAttachment.id.toString()
        ]
      })
      .set({
        Authorization: `Bearer ${accessToken}`
      })

    expect(response.status).toBe(201)

    const answerOnDatabase = await prisma.answer.findFirst({
      where: {
        content: 'Answer content'
      }
    })

    expect(answerOnDatabase).toBeTruthy()

    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        answerId: answerOnDatabase?.id
      }
    })

    expect(attachmentsOnDatabase).toHaveLength(2)
  })
})
