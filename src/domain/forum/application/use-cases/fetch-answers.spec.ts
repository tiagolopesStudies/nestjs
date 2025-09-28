import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answer-repository'
import { UniqueEntityId } from '../../enterprise/entities/value-objects/unique-entity-id'
import { AnswerRepository } from '../repositories/answer-repository'
import { FetchAnswersUseCase } from './fetch-answers'

let answerRepository: AnswerRepository
let sut: FetchAnswersUseCase

describe('Fetch recent questions', () => {
  beforeEach(() => {
    answerRepository = new InMemoryAnswerRepository()
    sut = new FetchAnswersUseCase(answerRepository)
  })

  it('should be able to fetch recent answers for a question', async () => {
    const questionId = new UniqueEntityId('question-id')

    await answerRepository.create(
      makeAnswer({ questionId, createdAt: new Date(2022, 0, 20) })
    )
    await answerRepository.create(
      makeAnswer({ questionId, createdAt: new Date(2022, 0, 23) })
    )
    await answerRepository.create(
      makeAnswer({ questionId, createdAt: new Date(2022, 0, 25) })
    )

    const result = await sut.execute({
      questionId: questionId.toString(),
      page: 1
    })

    if (!result.isRight()) return

    const { answers } = result.value

    expect(answers).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 25) })
    ])
  })

  it('should be able to fetch paginated recent answers for a question', async () => {
    const questionId = new UniqueEntityId('question-id')

    for (let i = 1; i <= 22; i++) {
      await answerRepository.create(makeAnswer({ questionId }))
    }

    const result = await sut.execute({
      questionId: questionId.toString(),
      page: 2
    })

    if (!result.isRight()) return

    const { answers } = result.value

    expect(answers).toHaveLength(2)
  })
})
