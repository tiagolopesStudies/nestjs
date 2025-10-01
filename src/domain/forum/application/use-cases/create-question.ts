import { Injectable } from '@nestjs/common'
import { Either, right } from '@/core/either'
import { UniqueEntityId } from '@/domain/forum/enterprise/entities/value-objects/unique-entity-id'
import { Question } from '../../enterprise/entities/question'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'
import { QuestionRepository } from '../repositories/question-repository'

interface createQuestionUseCaseRequest {
  instructorId: string
  title: string
  content: string
  attachmentsIds: string[]
}

type createQuestionUseCaseResponse = Either<null, { question: Question }>

@Injectable()
export class CreateQuestionUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    title,
    instructorId,
    content,
    attachmentsIds
  }: createQuestionUseCaseRequest): Promise<createQuestionUseCaseResponse> {
    const question = Question.create({
      title,
      content,
      authorId: new UniqueEntityId(instructorId)
    })

    const attachments = attachmentsIds.map((attachmentId) => {
      return QuestionAttachment.create({
        questionId: question.id,
        attachmentId: new UniqueEntityId(attachmentId)
      })
    })

    question.attachments = new QuestionAttachmentList(attachments)

    await this.questionRepository.create(question)

    return right({ question })
  }
}
