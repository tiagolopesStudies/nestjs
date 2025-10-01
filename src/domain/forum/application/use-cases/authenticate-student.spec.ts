import { FakeEncrypter } from 'test/cryptograph/fake-encrypter'
import { FakeHasher } from 'test/cryptograph/faker-hasher'
import { makeStudent } from 'test/factories/make-student'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'
import { AuthenticateStudentUseCase } from './authenticate-student'

let sut: AuthenticateStudentUseCase
let studentRepository: InMemoryStudentRepository
let hashComparer: FakeHasher
let encrypter: FakeEncrypter

describe('Authenticate Student', () => {
  beforeEach(() => {
    studentRepository = new InMemoryStudentRepository()
    hashComparer = new FakeHasher()
    encrypter = new FakeEncrypter()
    sut = new AuthenticateStudentUseCase(
      studentRepository,
      hashComparer,
      encrypter
    )
  })

  it('should be able to authenticate a student', async () => {
    const student = makeStudent({
      email: 'student@example.com',
      password: await hashComparer.hash('password')
    })

    await studentRepository.create(student)

    const result = await sut.execute({
      email: 'student@example.com',
      password: 'password'
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String)
    })
  })
})
