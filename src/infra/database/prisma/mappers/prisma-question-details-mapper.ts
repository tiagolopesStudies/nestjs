import {
  Attachment as PrismaAttachment,
  Question as PrismaQuestion,
  User as PrismaUser
} from 'generated/prisma'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { UniqueEntityId } from '@/domain/forum/enterprise/entities/value-objects/unique-entity-id'
import { PrismaAttachmentMapper } from './prisma-attachment-mapper'

type PrismaQuestionDetails = PrismaQuestion & {
  author: PrismaUser
  attachments: PrismaAttachment[]
}

export class PrismaQuestionDetailsMapper {
  static toDomain(raw: PrismaQuestionDetails): QuestionDetails {
    return QuestionDetails.create({
      questionId: new UniqueEntityId(raw.id),
      title: raw.title,
      content: raw.content,
      slug: Slug.create(raw.slug),
      authorId: new UniqueEntityId(raw.authorId),
      author: raw.author.name,
      bestAnswerId: raw.bestAnswerId
        ? new UniqueEntityId(raw.bestAnswerId)
        : null,
      attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt
    })
  }
}
