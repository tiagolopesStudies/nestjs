import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answer-repository'
import { UniqueEntityId } from '@/domain/forum/enterprise/entities/value-objects/unique-entity-id'
import { AnswerRepository } from '../repositories/answer-repository'
import { AnswerQuestionUseCase } from './answer-question'

let inMemoryAnswerRepository: AnswerRepository

describe('Answer question', () => {
  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswerRepository()
  })

  it('should be able to answer a question', async () => {
    const sut = new AnswerQuestionUseCase(inMemoryAnswerRepository)
    const result = await sut.execute({
      authorId: new UniqueEntityId('1'),
      questionId: new UniqueEntityId('1'),
      content: 'content',
      attachmentIds: ['1', '2']
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answer.content).toEqual('content')
    expect(result.value?.answer.attachments.currentItems).toHaveLength(2)
    expect(result.value?.answer.attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('2') })
    ])
  })
})
