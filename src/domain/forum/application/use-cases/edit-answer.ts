import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UseCaseError } from '@/core/errors/use-case-error'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'
import { UniqueEntityId } from '../../enterprise/entities/value-objects/unique-entity-id'
import { AnswerAttachmentRepository } from '../repositories/answer-attachment-repository'
import { AnswerRepository } from '../repositories/answer-repository'

interface EditAnswerUseCaseRequest {
  answerId: string
  authorId: string
  content: string
  attachmentsIds: string[]
}

type EditAnswerUseCaseResponse = Either<UseCaseError, { answer: Answer }>

@Injectable()
export class EditAnswerUseCase {
  constructor(
    private answerRepository: AnswerRepository,
    private answerAttachmentRepository: AnswerAttachmentRepository
  ) {}
  async execute({
    answerId,
    authorId,
    content,
    attachmentsIds
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (answer.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    const answerAttachments =
      await this.answerAttachmentRepository.findManyByAnswerId(answerId)

    const newAnswersAttachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        answerId: answer.id,
        attachmentId: new UniqueEntityId(attachmentId)
      })
    })

    const answerAttachmentList = new AnswerAttachmentList(answerAttachments)

    answerAttachmentList.update(newAnswersAttachments)

    answer.content = content
    answer.attachments = answerAttachmentList

    await this.answerRepository.save(answer)

    return right({ answer })
  }
}
