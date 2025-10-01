import { faker } from '@faker-js/faker'
import { Student } from '@/domain/forum/enterprise/entities/student'
import { UniqueEntityId } from '@/domain/forum/enterprise/entities/value-objects/unique-entity-id'

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
