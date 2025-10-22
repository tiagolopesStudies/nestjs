import { Injectable } from '@nestjs/common'
import {
  AnswerAttachment,
  AnswerAttachmentProps
} from '@/domain/forum/enterprise/entities/answer-attachment'
import { UniqueEntityId } from '@/domain/forum/enterprise/entities/value-objects/unique-entity-id'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeAnswerAttachment(
  override: Partial<AnswerAttachment> = {},
  id?: UniqueEntityId
) {
  return AnswerAttachment.create(
    {
      attachmentId: new UniqueEntityId(),
      answerId: new UniqueEntityId(),
      ...override
    },
    id
  )
}

@Injectable()
export class AnswerAttachmentFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaAnswerAttachment(data: Partial<AnswerAttachmentProps> = {}) {
    const questionAttachment = makeAnswerAttachment(data)

    await this.prisma.attachment.update({
      where: {
        id: questionAttachment.attachmentId.toString()
      },
      data: {
        answerId: questionAttachment.answerId.toString()
      }
    })

    return questionAttachment
  }
}
