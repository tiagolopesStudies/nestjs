import { faker } from '@faker-js/faker'

import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { UniqueEntityId } from '@/domain/forum/enterprise/entities/value-objects/unique-entity-id'

export function makeQuestionComment(
  override: Partial<QuestionComment> = {},
  id?: UniqueEntityId
) {
  return QuestionComment.create(
    {
      questionId: new UniqueEntityId(),
      authorId: new UniqueEntityId(),
      content: faker.lorem.text(),
      ...override
    },
    id
  )
}
