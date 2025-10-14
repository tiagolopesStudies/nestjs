import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import {
  Student,
  StudentProps
} from '@/domain/forum/enterprise/entities/student'
import { UniqueEntityId } from '@/domain/forum/enterprise/entities/value-objects/unique-entity-id'
import { PrismaStudentMapper } from '@/infra/database/prisma/mappers/prisma-student-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeStudent(
  override: Partial<Student> = {},
  id?: UniqueEntityId
) {
  return Student.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override
    },
    id
  )
}

@Injectable()
export class StudentFactory {
  constructor(private readonly prismaService: PrismaService) {}

  async makePrismaStudent(data: Partial<StudentProps> = {}) {
    const student = makeStudent(data)

    await this.prismaService.user.create({
      data: PrismaStudentMapper.toPrisma(student)
    })

    return student
  }
}
