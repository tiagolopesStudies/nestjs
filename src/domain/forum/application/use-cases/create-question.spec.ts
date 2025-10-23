import { InMemoryAttachmentRepository } from 'test/repositories/in-memory-attachment-repository'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachment-repository'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'
import { UniqueEntityId } from '../../enterprise/entities/value-objects/unique-entity-id'
import { CreateQuestionUseCase } from './create-question'

let questionRepository: InMemoryQuestionRepository
let questionAttachmentRepository: InMemoryQuestionAttachmentRepository
let sut: CreateQuestionUseCase

describe('Create question', () => {
  beforeEach(() => {
    questionAttachmentRepository = new InMemoryQuestionAttachmentRepository()
    questionRepository = new InMemoryQuestionRepository(
      questionAttachmentRepository,
      new InMemoryAttachmentRepository(),
      new InMemoryStudentRepository()
    )
    sut = new CreateQuestionUseCase(questionRepository)
  })

  it('should be able to ask a question', async () => {
    const result = await sut.execute({
      instructorId: '1234',
      title: 'Teste de título',
      content: 'content',
      attachmentsIds: ['1', '2']
    })

    expect(result.isRight()).toBeTruthy()
    expect(questionAttachmentRepository.items).toHaveLength(2)
    expect(questionAttachmentRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
        expect.objectContaining({ attachmentId: new UniqueEntityId('2') })
      ])
    )
  })
})
