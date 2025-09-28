import { makeInMemoryQuestionRepository } from 'test/factories/make-in-memory-question-repository'
import { QuestionRepository } from '../repositories/question-repository'
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'
import { makeQuestion } from 'test/factories/make-question'

let questionRepository: QuestionRepository
let sut: FetchRecentQuestionsUseCase

describe('Fetch recent questions', () => {
  beforeEach(() => {
    questionRepository = makeInMemoryQuestionRepository()
    sut = new FetchRecentQuestionsUseCase(questionRepository)
  })

  it('should be able to fetch recent questions in creating order', async () => {
    await questionRepository.create(
      makeQuestion({ createdAt: new Date(2022, 0, 25) })
    )
    await questionRepository.create(
      makeQuestion({ createdAt: new Date(2022, 0, 19) })
    )
    await questionRepository.create(
      makeQuestion({ createdAt: new Date(2022, 0, 20) })
    )

    const result = await sut.execute({ page: 1 })

    if (!result.isRight()) return

    const { questions } = result.value

    expect(questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 19) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 25) })
    ])
  })

  it('should be able to fetch paginated recent questions', async () => {
    for (let i = 1; i <= 22; i++) {
      await questionRepository.create(makeQuestion())
    }

    const result = await sut.execute({ page: 2 })

    if (!result.isRight()) return

    const { questions } = result.value

    expect(questions).toHaveLength(2)
  })
})
