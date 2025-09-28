import { describe, beforeEach, it, expect } from 'vitest'

import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comment-repository'
import { UniqueEntityId } from '../../enterprise/entities/value-objects/unique-entity-id'
import { QuestionCommentRepository } from '../repositories/question-comment-repository'
import { NotAllowedError } from '../../../../core/errors/not-allowed-error'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found-error'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'

let sut: DeleteQuestionCommentUseCase
let questionCommentRepository: QuestionCommentRepository

describe('Delete a comment on question', () => {
  beforeEach(() => {
    questionCommentRepository = new InMemoryQuestionCommentRepository()
    sut = new DeleteQuestionCommentUseCase(questionCommentRepository)
  })

  it('should be able to delete a comment on question', async () => {
    const questionComment = makeQuestionComment()
    await questionCommentRepository.create(questionComment)

    await sut.execute({
      authorId: questionComment.authorId.toString(),
      questionCommentId: questionComment.id.toString()
    })

    const questionCommentDeleted = await questionCommentRepository.findById(
      questionComment.id.toString()
    )

    expect(questionCommentDeleted).toBeNull()
  })

  it('should not be able to delete a comment on question from another user', async () => {
    const questionComment = makeQuestionComment({
      authorId: new UniqueEntityId('user-id')
    })
    await questionCommentRepository.create(questionComment)

    const result = await sut.execute({
      authorId: 'another-user-id',
      questionCommentId: questionComment.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to delete an inexistent comment on question', async () => {
    const result = await sut.execute({
      authorId: 'any-author-id',
      questionCommentId: 'any-question-comment-id'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
