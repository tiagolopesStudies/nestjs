import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { Encrypter } from '../cryptography/encrypter'
import { HashComparer } from '../cryptography/hash-comparer'
import { StudentRepository } from '../repositories/student-repository'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

interface AuthenticateStudentUseCaseRequest {
  email: string
  password: string
}

type AuthenticateStudentUseCaseResponse = Promise<
  Either<WrongCredentialsError, { accessToken: string }>
>

@Injectable()
export class AuthenticateStudentUseCase {
  constructor(
    private readonly studentsRepository: StudentRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter
  ) {}

  async execute({
    email,
    password
  }: AuthenticateStudentUseCaseRequest): AuthenticateStudentUseCaseResponse {
    const student = await this.studentsRepository.findByEmail(email)

    if (!student) {
      return left(new WrongCredentialsError())
    }

    const doesPasswordMatch = await this.hashComparer.compare(
      password,
      student.password
    )

    if (!doesPasswordMatch) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: student.id.toString()
    })

    return right({ accessToken })
  }
}
