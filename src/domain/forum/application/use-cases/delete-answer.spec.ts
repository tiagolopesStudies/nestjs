import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answer-repository'
import { AnswerRepository } from '../repositories/answer-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityId } from '../../enterprise/entities/value-objects/unique-entity-id'
import { DeleteAnswerUseCase } from './delete-answer'
import { NotAllowedError } from '../../../../core/errors/not-allowed-error'

let inMemoryAnswerRepository: AnswerRepository
let sut: DeleteAnswerUseCase

describe('Delete answer', () => {
  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswerRepository()
    sut = new DeleteAnswerUseCase(inMemoryAnswerRepository)
  })

  it('should be able to delete a answer', async () => {
    const answerId = '1234'
    const authorId = '4321'

    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityId(authorId) },
      new UniqueEntityId(answerId)
    )
    await inMemoryAnswerRepository.create(newAnswer)

    await sut.execute({ answerId, authorId })

    const answer = await inMemoryAnswerRepository.findById(answerId)

    expect(answer).toBeNull()
  })

  it('should not be able to delete a answer from another user', async () => {
    const answerId = '1234'

    const newAnswer = makeAnswer({}, new UniqueEntityId(answerId))
    await inMemoryAnswerRepository.create(newAnswer)

    const result = await sut.execute({
      answerId,
      authorId: '4321'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
