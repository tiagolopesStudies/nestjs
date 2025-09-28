import { faker } from '@faker-js/faker'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { UniqueEntityId } from '@/domain/forum/enterprise/entities/value-objects/unique-entity-id'

export function makeAnswer(
  override: Partial<Answer> = {},
  id?: UniqueEntityId
) {
  return Answer.create(
    {
      questionId: new UniqueEntityId(),
      authorId: new UniqueEntityId(),
      content: faker.lorem.text(),
      ...override
    },
    id
  )
}
