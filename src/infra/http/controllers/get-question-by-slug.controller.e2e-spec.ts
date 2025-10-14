import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Get question by slug (e2e)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory]
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('GET /questions/:slug', async () => {
    const user = await studentFactory.makePrismaStudent()
    const accessToken = await jwt.signAsync({ sub: user.id.toString() })

    await questionFactory.makePrismaQuestion({
      authorId: user.id,
      slug: Slug.create('new-question'),
      title: 'New question',
      content: 'Question content'
    })

    const response = await request(app.getHttpServer())
      .get('/questions/new-question')
      .set({
        Authorization: `Bearer ${accessToken}`
      })

    expect(response.status).toBe(200)
    expect(response.body.question).toEqual(
      expect.objectContaining({
        title: 'New question',
        content: 'Question content',
        slug: 'new-question'
      })
    )
  })
})
