import { faker } from '@faker-js/faker'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { UniqueEntityId } from '@/domain/forum/enterprise/entities/value-objects/unique-entity-id'

export function makeQuestion(
  override: Partial<Question> = {},
  id?: UniqueEntityId
) {
  return Question.create(
    {
      authorId: new UniqueEntityId(),
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      ...override
    },
    id
  )
}
