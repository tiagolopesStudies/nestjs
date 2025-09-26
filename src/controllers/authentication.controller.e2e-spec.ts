import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import bcryptjs from 'bcryptjs'
import request from 'supertest'
import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'

describe('Authentication (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('POST /sessions', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456'
    }

    await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: bcryptjs.hashSync(userData.password, 8)
      }
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: userData.email,
      password: userData.password
    })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('access_token')
  })
})
