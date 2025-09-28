import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/prisma/prisma.service'

describe('Fetch questions (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('GET /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: '123456'
      }
    })

    const accessToken = await jwt.signAsync({ sub: user.id })

    await prisma.question.create({
      data: {
        title: 'New question',
        content: 'Question content',
        slug: 'new-question',
        authorId: user.id
      }
    })

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set({
        Authorization: `Bearer ${accessToken}`
      })

    expect(response.status).toBe(200)
    expect(response.body.questions).toHaveLength(1)
    expect(response.body.questions[0]).toEqual(
      expect.objectContaining({
        title: 'New question',
        content: 'Question content',
        slug: 'new-question',
        authorId: user.id
      })
    )
  })
})
