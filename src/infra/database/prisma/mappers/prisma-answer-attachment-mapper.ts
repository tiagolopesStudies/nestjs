import { Attachment as PrismaAttachment } from 'generated/prisma'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { UniqueEntityId } from '@/domain/forum/enterprise/entities/value-objects/unique-entity-id'

export class PrismaAnswerAttachmentMapper {
  static toDomain(raw: PrismaAttachment): AnswerAttachment {
    if (!raw.answerId) {
      throw new Error('Attachment is not linked to an answer.')
    }

    return AnswerAttachment.create(
      {
        attachmentId: new UniqueEntityId(raw.id),
        answerId: new UniqueEntityId(raw.answerId)
      },
      new UniqueEntityId(raw.id)
    )
  }
}
