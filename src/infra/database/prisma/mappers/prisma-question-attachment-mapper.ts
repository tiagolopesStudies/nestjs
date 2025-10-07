import { Attachment as PrismaAttachment } from 'generated/prisma'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { UniqueEntityId } from '@/domain/forum/enterprise/entities/value-objects/unique-entity-id'

export class PrismaQuestionAttachmentMapper {
  static toDomain(raw: PrismaAttachment): QuestionAttachment {
    if (!raw.questionId) {
      throw new Error('Attachment is not linked to a question.')
    }

    return QuestionAttachment.create(
      {
        attachmentId: new UniqueEntityId(raw.id),
        questionId: new UniqueEntityId(raw.questionId)
      },
      new UniqueEntityId(raw.id)
    )
  }
}
