import { Prisma, User as PrismaStudent } from 'generated/prisma'
import { Student } from '@/domain/forum/enterprise/entities/student'
import { UniqueEntityId } from '@/domain/forum/enterprise/entities/value-objects/unique-entity-id'

export class PrismaStudentMapper {
  static toDomain(raw: PrismaStudent): Student {
    return Student.create(
      {
        email: raw.email,
        name: raw.name,
        password: raw.password
      },
      new UniqueEntityId(raw.id)
    )
  }

  static toPrisma(student: Student): Prisma.UserUncheckedCreateInput {
    return {
      id: student.id.toString(),
      email: student.email,
      name: student.name,
      password: student.password
    }
  }
}
