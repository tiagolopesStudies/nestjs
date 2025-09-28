import { makeInMemoryQuestionRepository } from 'test/factories/make-in-memory-question-repository'
import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comment-repository'
import { QuestionRepository } from '../repositories/question-repository'
import { QuestionCommentRepository } from '../repositories/question-comment-repository'
import { CommentOnQuestionUseCase } from './comment-on-question'
import { makeQuestion } from 'test/factories/make-question'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found-error'

let sut: CommentOnQuestionUseCase
let questionRepository: QuestionRepository
let questionCommentsRepository: QuestionCommentRepository

describe('Comment on question', () => {
  beforeEach(() => {
    questionRepository = makeInMemoryQuestionRepository()
    questionCommentsRepository = new InMemoryQuestionCommentRepository()

    sut = new CommentOnQuestionUseCase(
      questionRepository,
      questionCommentsRepository
    )
  })

  it('should be able to comment on question', async () => {
    const question = makeQuestion()
    await questionRepository.create(question)

    const result = await sut.execute({
      questionId: question.id.toString(),
      authorId: '1',
      content: 'content'
    })

    if (!result.isRight()) return

    const createdComment = await questionCommentsRepository.findById(
      result.value.questionComment.id.toString()
    )

    expect(createdComment).toBeTruthy()
  })

  it('should not be able to comment on an inexistent question', async () => {
    const result = await sut.execute({
      questionId: '1',
      authorId: '1',
      content: 'content'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
