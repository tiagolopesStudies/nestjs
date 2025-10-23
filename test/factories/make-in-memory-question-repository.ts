import { InMemoryAttachmentRepository } from 'test/repositories/in-memory-attachment-repository'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachment-repository'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'

export function makeInMemoryQuestionRepository() {
  return new InMemoryQuestionRepository(
    new InMemoryQuestionAttachmentRepository(),
    new InMemoryAttachmentRepository(),
    new InMemoryStudentRepository()
  )
}
