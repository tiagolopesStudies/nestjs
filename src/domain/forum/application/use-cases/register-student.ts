import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { Student } from '../../enterprise/entities/student'
import { HashGenerator } from '../cryptography/hash-generator'
import { StudentRepository } from '../repositories/student-repository'
import { StudentAlreadyExistsError } from './errors/student-already-exists-error'

interface RegisterStudentUseCaseRequest {
  name: string
  email: string
  password: string
}

type RegisterStudentUseCaseResponse = Promise<
  Either<StudentAlreadyExistsError, { student: Student }>
>

@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private readonly studentsRepository: StudentRepository,
    private readonly hashGenerator: HashGenerator
  ) {}

  async execute({
    name,
    email,
    password
  }: RegisterStudentUseCaseRequest): RegisterStudentUseCaseResponse {
    const existingStudent = await this.studentsRepository.findByEmail(email)

    if (existingStudent) {
      return left(new StudentAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const student = Student.create({
      name,
      email,
      password: hashedPassword
    })

    await this.studentsRepository.create(student)

    return right({ student })
  }
}
