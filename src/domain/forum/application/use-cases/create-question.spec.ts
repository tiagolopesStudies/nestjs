import { makeInMemoryQuestionRepository } from 'test/factories/make-in-memory-question-repository'
import { UniqueEntityId } from '../../enterprise/entities/value-objects/unique-entity-id'
import { QuestionRepository } from '../repositories/question-repository'
import { CreateQuestionUseCase } from './create-question'

let inMemoryQuestionRepository: QuestionRepository
let sut: CreateQuestionUseCase

describe('Create question', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = makeInMemoryQuestionRepository()
    sut = new CreateQuestionUseCase(inMemoryQuestionRepository)
  })

  it('should be able to ask a question', async () => {
    const result = await sut.execute({
      instructorId: '1234',
      title: 'Teste de título',
      content: 'content',
      attachmentsIds: ['1', '2']
    })

    if (!result.isRight()) return

    expect(result.value.question.id).toBeTruthy()
    expect(result.value.question.attachments.currentItems).toHaveLength(2)
    expect(result.value.question.attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('2') })
    ])
  })
})
