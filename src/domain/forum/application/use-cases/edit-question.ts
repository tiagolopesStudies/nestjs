import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionAttachmentRepository } from '../repositories/question-attachment-repository'
import { QuestionRepository } from '../repositories/question-repository'
import { Either, left, right } from '@/core/either'
import { UseCaseError } from '@/core/errors/use-case-error'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found-error'
import { NotAllowedError } from '../../../../core/errors/not-allowed-error'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { UniqueEntityId } from '../../enterprise/entities/value-objects/unique-entity-id'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'

interface EditQuestionUseCaseRequest {
  questionId: string
  authorId: string
  title: string
  content: string
  attachmentsIds: string[]
}

type EditQuestionUseCaseResponse = Either<UseCaseError, { question: Question }>

export class EditQuestionUseCase {
  constructor(
    private questionRepository: QuestionRepository,
    private questionAttachmentsRepository: QuestionAttachmentRepository
  ) {}

  async execute({
    questionId,
    authorId,
    title,
    content,
    attachmentsIds
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (question.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    const questionAttachments =
      await this.questionAttachmentsRepository.findManyByQuestionId(questionId)

    const newQuestionAttachments = attachmentsIds.map((attachmentId) => {
      return QuestionAttachment.create({
        questionId: question.id,
        attachmentId: new UniqueEntityId(attachmentId)
      })
    })

    const questionAttachmentsList = new QuestionAttachmentList(
      questionAttachments
    )

    questionAttachmentsList.update(newQuestionAttachments)

    question.title = title
    question.content = content
    question.attachments = questionAttachmentsList

    await this.questionRepository.save(question)

    return right({ question })
  }
}
