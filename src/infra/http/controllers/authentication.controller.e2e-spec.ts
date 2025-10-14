import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import bcryptjs from 'bcryptjs'
import request from 'supertest'
import { StudentFactory } from 'test/factories/make-student'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Authentication (e2e)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory]
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)

    await app.init()
  })

  test('POST /sessions', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456'
    }

    await studentFactory.makePrismaStudent({
      name: userData.name,
      email: userData.email,
      password: await bcryptjs.hash(userData.password, 6)
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: userData.email,
      password: userData.password
    })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('access_token')
  })
})
