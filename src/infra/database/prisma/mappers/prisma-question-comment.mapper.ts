import { Prisma, Comment as PrismaComment } from 'generated/prisma'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { UniqueEntityId } from '@/domain/forum/enterprise/entities/value-objects/unique-entity-id'

export class PrismaQuestionCommentMapper {
  static toDomain(raw: PrismaComment): QuestionComment {
    if (!raw.questionId) {
      throw new Error('Invalid question comment.')
    }

    return QuestionComment.create(
      {
        content: raw.content,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        authorId: new UniqueEntityId(raw.authorId),
        questionId: new UniqueEntityId(raw.questionId)
      },
      new UniqueEntityId(raw.id)
    )
  }

  static toPrisma(
    comment: QuestionComment
  ): Prisma.CommentUncheckedCreateInput {
    return {
      id: comment.id.toValue(),
      authorId: comment.authorId.toValue(),
      questionId: comment.questionId.toValue(),
      content: comment.content,
      createdAt: comment.createdAt
    }
  }
}
