import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { UniqueEntityId } from '@/domain/forum/enterprise/entities/value-objects/unique-entity-id'
import { Either, right } from '@/core/either'
import { AnswerRepository } from '../repositories/answer-repository'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'

interface AnswerQuestionUseCaseRequest {
  instructorId: UniqueEntityId
  questionId: UniqueEntityId
  content: string
  attachmentIds: string[]
}

type AnswerQuestionUseCaseResponse = Either<null, { answer: Answer }>

export class AnswerQuestionUseCase {
  constructor(private answerRepository: AnswerRepository) {}

  async execute({
    instructorId,
    questionId,
    content,
    attachmentIds
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      content,
      authorId: instructorId,
      questionId
    })

    const attachments = attachmentIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        answerId: answer.id
      })
    })

    answer.attachments = new AnswerAttachmentList(attachments)

    await this.answerRepository.create(answer)

    return right({ answer })
  }
}
