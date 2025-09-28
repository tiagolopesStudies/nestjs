import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachment-repository'
import { makeQuestion } from 'test/factories/make-question'
import { QuestionAttachmentRepository } from '../repositories/question-attachment-repository'
import { QuestionRepository } from '../repositories/question-repository'
import { UniqueEntityId } from '../../enterprise/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '../../../../core/errors/not-allowed-error'
import { EditQuestionUseCase } from './edit-question'

let inMemoryQuestionRepository: QuestionRepository
let inMemoryQuestionAttachmentRepository: QuestionAttachmentRepository
let sut: EditQuestionUseCase

describe('Edit question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository()
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository
    )
    sut = new EditQuestionUseCase(
      inMemoryQuestionRepository,
      inMemoryQuestionAttachmentRepository
    )
  })

  it('should be able to edit a question', async () => {
    const title = 'New title'
    const content = 'New content'

    const question = makeQuestion()
    await inMemoryQuestionRepository.create(question)

    const result = await sut.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      title,
      content,
      attachmentsIds: ['1', '2', '3']
    })

    if (!result.isRight()) return

    expect(result.value.question).toMatchObject({
      title,
      content
    })
    expect(result.value.question.attachments.currentItems).toHaveLength(3)
    expect(result.value.question.attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('3') })
    ])
  })

  it('should not be able to delete a question from another user', async () => {
    const title = 'New title'
    const content = 'New content'
    const authorId = new UniqueEntityId('author-1')

    const question = makeQuestion({ authorId })
    await inMemoryQuestionRepository.create(question)

    const result = await sut.execute({
      questionId: question.id.toString(),
      authorId: 'fake-author-id',
      title,
      content,
      attachmentsIds: []
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
