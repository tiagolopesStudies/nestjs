import { Prisma, Attachment as PrismaAttachment } from 'generated/prisma'
import { Attachment } from '@/domain/forum/enterprise/entities/attachment'
import { UniqueEntityId } from '@/domain/forum/enterprise/entities/value-objects/unique-entity-id'

export class PrismaAttachmentMapper {
  static toDomain(raw: PrismaAttachment): Attachment {
    return Attachment.create(
      {
        title: raw.title,
        url: raw.url
      },
      new UniqueEntityId(raw.id)
    )
  }

  static toPrisma(
    attachment: Attachment
  ): Prisma.AttachmentUncheckedCreateInput {
    return {
      id: attachment.id.toString(),
      title: attachment.title,
      url: attachment.url
    }
  }
}
