import { makeInMemoryQuestionRepository } from 'test/factories/make-in-memory-question-repository'
import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comment-repository'
import { makeQuestion } from 'test/factories/make-question'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { QuestionRepository } from '../repositories/question-repository'
import { QuestionCommentRepository } from '../repositories/question-comment-repository'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'

let sut: FetchQuestionCommentsUseCase
let questionRepository: QuestionRepository
let questionCommentsRepository: QuestionCommentRepository

describe('Comment on question', () => {
  beforeEach(() => {
    questionRepository = makeInMemoryQuestionRepository()
    questionCommentsRepository = new InMemoryQuestionCommentRepository()

    sut = new FetchQuestionCommentsUseCase(
      questionRepository,
      questionCommentsRepository
    )
  })

  it('should be able to fetch comments on question', async () => {
    const question = makeQuestion()
    await questionRepository.create(question)

    await questionCommentsRepository.create(
      makeQuestionComment({
        questionId: question.id,
        createdAt: new Date('2025-05-01')
      })
    )

    await questionCommentsRepository.create(
      makeQuestionComment({
        questionId: question.id,
        createdAt: new Date('2025-05-10')
      })
    )

    await questionCommentsRepository.create(
      makeQuestionComment({
        questionId: question.id,
        createdAt: new Date('2025-05-06')
      })
    )

    const result = await sut.execute({
      questionId: question.id.toString(),
      page: 1
    })

    if (!result.isRight()) return

    const { questionComments } = result.value

    expect(questionComments).toHaveLength(3)
    expect(questionComments).toEqual([
      expect.objectContaining({ createdAt: new Date('2025-05-01') }),
      expect.objectContaining({ createdAt: new Date('2025-05-06') }),
      expect.objectContaining({ createdAt: new Date('2025-05-10') })
    ])
  })

  it('should be able to fetch paginated comments on question', async () => {
    const question = makeQuestion()
    await questionRepository.create(question)

    for (let i = 1; i <= 22; i++) {
      await questionCommentsRepository.create(
        makeQuestionComment({ questionId: question.id })
      )
    }

    const result = await sut.execute({
      questionId: question.id.toString(),
      page: 2
    })

    if (!result.isRight()) return

    const { questionComments } = result.value

    expect(questionComments).toHaveLength(2)
  })
})
