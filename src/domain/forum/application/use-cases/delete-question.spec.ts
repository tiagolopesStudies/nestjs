import { makeInMemoryQuestionRepository } from 'test/factories/make-in-memory-question-repository'
import { makeQuestion } from 'test/factories/make-question'
import { QuestionRepository } from '../repositories/question-repository'
import { UniqueEntityId } from '../../enterprise/entities/value-objects/unique-entity-id'
import { DeleteQuestionUseCase } from './delete-question'
import { NotAllowedError } from '../../../../core/errors/not-allowed-error'

let inMemoryQuestionRepository: QuestionRepository
let sut: DeleteQuestionUseCase

describe('Delete question', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = makeInMemoryQuestionRepository()
    sut = new DeleteQuestionUseCase(inMemoryQuestionRepository)
  })

  it('should be able to delete a question', async () => {
    const questionId = '1234'
    const authorId = '4321'

    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityId(authorId) },
      new UniqueEntityId(questionId)
    )
    await inMemoryQuestionRepository.create(newQuestion)

    await sut.execute({ questionId, authorId })

    const question = await inMemoryQuestionRepository.findById(questionId)

    expect(question).toBeNull()
  })

  it('should not be able to delete a question from another user', async () => {
    const questionId = '1234'

    const newQuestion = makeQuestion({}, new UniqueEntityId(questionId))
    await inMemoryQuestionRepository.create(newQuestion)

    const result = await sut.execute({
      questionId,
      authorId: '4321'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
