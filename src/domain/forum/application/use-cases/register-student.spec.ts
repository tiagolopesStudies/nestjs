import { FakeHasher } from 'test/cryptograph/faker-hasher'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'
import { HashGenerator } from '../cryptography/hash-generator'
import { RegisterStudentUseCase } from './register-student'

let sut: RegisterStudentUseCase
let studentsRepository: InMemoryStudentRepository
let hashGenerator: HashGenerator

describe('Register Student', () => {
  beforeEach(() => {
    studentsRepository = new InMemoryStudentRepository()
    hashGenerator = new FakeHasher()
    sut = new RegisterStudentUseCase(studentsRepository, hashGenerator)
  })

  it('should be able to register a student', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123'
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      student: studentsRepository.students[0]
    })
  })

  it('should be hash the student password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123'
    })

    expect(result.isRight()).toBe(true)
    const student = studentsRepository.students[0]

    expect(student.password).toBe('password123-hashed')
  })
})
