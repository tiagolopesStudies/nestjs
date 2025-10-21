import { Injectable } from '@nestjs/common'
import {
  QuestionAttachment,
  QuestionAttachmentProps
} from '@/domain/forum/enterprise/entities/question-attachment'
import { UniqueEntityId } from '@/domain/forum/enterprise/entities/value-objects/unique-entity-id'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeQuestionAttachment(
  override: Partial<QuestionAttachment> = {},
  id?: UniqueEntityId
) {
  return QuestionAttachment.create(
    {
      attachmentId: new UniqueEntityId(),
      questionId: new UniqueEntityId(),
      ...override
    },
    id
  )
}

@Injectable()
export class QuestionAttachmentFactory {
  constructor(private readonly prismaService: PrismaService) {}

  async makePrismaQuestionAttachment(
    data: Partial<QuestionAttachmentProps> = {}
  ) {
    const questionAttachment = makeQuestionAttachment(data)

    await this.prismaService.attachment.update({
      where: {
        id: questionAttachment.attachmentId.toString()
      },
      data: {
        questionId: questionAttachment.questionId.toString()
      }
    })

    return questionAttachment
  }
}
