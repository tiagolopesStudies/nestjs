import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-comment-repository'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UniqueEntityId } from '../../enterprise/entities/value-objects/unique-entity-id'
import { AnswerCommentRepository } from '../repositories/answer-comment-repository'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'

let sut: DeleteAnswerCommentUseCase
let answerCommentRepository: AnswerCommentRepository

describe('Delete a comment on answer', () => {
  beforeEach(() => {
    answerCommentRepository = new InMemoryAnswerCommentRepository(
      new InMemoryStudentRepository()
    )

    sut = new DeleteAnswerCommentUseCase(answerCommentRepository)
  })

  it('should be able to delete a comment on answer', async () => {
    const answerComment = makeAnswerComment()

    await answerCommentRepository.create(answerComment)

    await sut.execute({
      authorId: answerComment.authorId.toString(),
      answerCommentId: answerComment.id.toString()
    })

    const deletedAnswerComment = await answerCommentRepository.findById(
      answerComment.id.toString()
    )

    expect(deletedAnswerComment).toBeNull()
  })

  it('should not be able to delete a comment on answer from another user', async () => {
    const answerComment = makeAnswerComment({
      authorId: new UniqueEntityId('user-id')
    })

    await answerCommentRepository.create(answerComment)

    const result = await sut.execute({
      authorId: 'another-user-id',
      answerCommentId: answerComment.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to delete a not existent answer comment', async () => {
    const result = await sut.execute({
      authorId: 'user-id',
      answerCommentId: 'answer-comment-id'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
