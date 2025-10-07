import { Prisma, Comment as PrismaComment } from 'generated/prisma'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { UniqueEntityId } from '@/domain/forum/enterprise/entities/value-objects/unique-entity-id'

export class PrismaAnswerCommentMapper {
  static toDomain(raw: PrismaComment): AnswerComment {
    if (!raw.answerId) {
      throw new Error('Invalid answer comment.')
    }

    return AnswerComment.create(
      {
        content: raw.content,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        authorId: new UniqueEntityId(raw.authorId),
        answerId: new UniqueEntityId(raw.answerId)
      },
      new UniqueEntityId(raw.id)
    )
  }

  static toPrisma(comment: AnswerComment): Prisma.CommentUncheckedCreateInput {
    return {
      id: comment.id.toValue(),
      authorId: comment.authorId.toValue(),
      answerId: comment.answerId.toValue(),
      content: comment.content,
      createdAt: comment.createdAt
    }
  }
}
