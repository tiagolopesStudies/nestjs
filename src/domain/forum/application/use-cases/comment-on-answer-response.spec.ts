import { AnswerRepository } from '../repositories/answer-repository'
import { AnswerCommentRepository } from '../repositories/answer-comment-repository'
import { CommentOnAnswerUseCase } from './comment-on-answer'
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answer-repository'
import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-comment-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found-error'

let sut: CommentOnAnswerUseCase
let answerRepository: AnswerRepository
let answerCommentRepository: AnswerCommentRepository

describe('Comment on answer', () => {
  beforeEach(() => {
    answerRepository = new InMemoryAnswerRepository()
    answerCommentRepository = new InMemoryAnswerCommentRepository()

    sut = new CommentOnAnswerUseCase(answerRepository, answerCommentRepository)
  })

  it('should be able to comment on answer', async () => {
    const answer = makeAnswer()
    await answerRepository.create(answer)

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: '1',
      content: 'content'
    })

    if (!result.isRight()) return

    const createdAnswerComment = await answerCommentRepository.findById(
      result.value.answerComment.id.toString()
    )

    expect(createdAnswerComment).toBeTruthy()
  })

  it('should not be able to comment on an inexistent answer', async () => {
    const result = await sut.execute({
      answerId: '1234',
      authorId: '1',
      content: 'content'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
