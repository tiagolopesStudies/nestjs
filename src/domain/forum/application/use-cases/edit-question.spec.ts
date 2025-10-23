import { makeQuestion } from 'test/factories/make-question'
import { InMemoryAttachmentRepository } from 'test/repositories/in-memory-attachment-repository'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachment-repository'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'
import { NotAllowedError } from '../../../../core/errors/not-allowed-error'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { UniqueEntityId } from '../../enterprise/entities/value-objects/unique-entity-id'
import { EditQuestionUseCase } from './edit-question'

let inMemoryQuestionRepository: InMemoryQuestionRepository
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository
let sut: EditQuestionUseCase

describe('Edit question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository()
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository,
      new InMemoryAttachmentRepository(),
      new InMemoryStudentRepository()
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

  it('should not be able to edit a question from another user', async () => {
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

  it('should update attachments when a question is updated', async () => {
    const title = 'New title'
    const content = 'New content'

    const question = makeQuestion()
    await inMemoryQuestionRepository.create(question)

    inMemoryQuestionAttachmentRepository.items.push(
      QuestionAttachment.create({
        attachmentId: new UniqueEntityId('1'),
        questionId: question.id
      }),
      QuestionAttachment.create({
        attachmentId: new UniqueEntityId('2'),
        questionId: question.id
      })
    )

    const result = await sut.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      title,
      content,
      attachmentsIds: ['1', '3']
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryQuestionAttachmentRepository.items.length).toEqual(2)
    expect(inMemoryQuestionAttachmentRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityId('1')
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityId('3')
        })
      ])
    )
  })
})
