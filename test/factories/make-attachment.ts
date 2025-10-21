import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import {
  Attachment,
  AttachmentProps
} from '@/domain/forum/enterprise/entities/attachment'
import { UniqueEntityId } from '@/domain/forum/enterprise/entities/value-objects/unique-entity-id'
import { PrismaAttachmentMapper } from '@/infra/database/prisma/mappers/prisma-attachment-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeAttachment(
  override: Partial<Attachment> = {},
  id?: UniqueEntityId
) {
  return Attachment.create(
    {
      title: faker.person.fullName(),
      url: faker.internet.url(),
      ...override
    },
    id
  )
}

@Injectable()
export class AttachmentFactory {
  constructor(private readonly prismaService: PrismaService) {}

  async makePrismaAttachment(data: Partial<AttachmentProps> = {}) {
    const attachment = makeAttachment(data)

    await this.prismaService.attachment.create({
      data: PrismaAttachmentMapper.toPrisma(attachment)
    })

    return attachment
  }
}
