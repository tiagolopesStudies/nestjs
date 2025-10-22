import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answer-attachment-repository'
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answer-repository'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UniqueEntityId } from '../../enterprise/entities/value-objects/unique-entity-id'
import { EditAnswerUseCase } from './edit-answer'

let answerRepository: InMemoryAnswerRepository
let answerAttachmentRepository: InMemoryAnswerAttachmentRepository
let sut: EditAnswerUseCase

describe('Edit answer', () => {
  beforeEach(() => {
    answerRepository = new InMemoryAnswerRepository()
    answerAttachmentRepository = new InMemoryAnswerAttachmentRepository()
    sut = new EditAnswerUseCase(answerRepository, answerAttachmentRepository)
  })

  it('should be able to edit a answer', async () => {
    const answerId = '1234'
    const authorId = '4321'
    const updatedContent = 'content edited'
    const answer = makeAnswer(
      {
        content: 'any',
        authorId: new UniqueEntityId(authorId)
      },
      new UniqueEntityId(answerId)
    )

    await answerRepository.create(answer)

    const result = await sut.execute({
      answerId,
      authorId,
      content: updatedContent,
      attachmentsIds: ['1', '2', '3']
    })

    if (!result.isRight()) return

    expect(result.isRight()).toBe(true)
    expect(result.value.answer.content).toEqual('content edited')
  })

  it('should not be able to edit a answer from another user', async () => {
    const answerId = '1234'

    const newAnswer = makeAnswer({}, new UniqueEntityId(answerId))
    await answerRepository.create(newAnswer)

    const result = await sut.execute({
      answerId,
      authorId: '4321',
      content: 'content edited',
      attachmentsIds: ['1', '2', '3']
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to edit a answer that does not exist', async () => {
    const result = await sut.execute({
      answerId: '1234',
      authorId: '4321',
      content: 'content edited',
      attachmentsIds: ['1', '2', '3']
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
