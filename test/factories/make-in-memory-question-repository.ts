import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachment-repository'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository'

export function makeInMemoryQuestionRepository() {
  const questionAttachmentRepository =
    new InMemoryQuestionAttachmentRepository()
  return new InMemoryQuestionRepository(questionAttachmentRepository)
}
