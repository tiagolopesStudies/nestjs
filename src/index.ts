import { Question } from '@/domain/forum/enterprise/entities/question'
import { UniqueEntityId } from '@/domain/forum/enterprise/entities/value-objects/unique-entity-id'

const question = Question.create({
  authorId: new UniqueEntityId(),
  title: 'title',
  content: 'content'
})

console.log(question.isNew)
