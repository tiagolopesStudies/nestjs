import { Comment as PrismaComment, User as PrismaUser } from 'generated/prisma'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { UniqueEntityId } from '@/domain/forum/enterprise/entities/value-objects/unique-entity-id'

type PrismaCommentWithAuthor = PrismaComment & {
  author: PrismaUser
}

export class PrismaCommentWithAuthorMapper {
  static toDomain(raw: PrismaCommentWithAuthor): CommentWithAuthor {
    return CommentWithAuthor.create({
      commentId: new UniqueEntityId(raw.id),
      content: raw.content,
      authorId: new UniqueEntityId(raw.authorId),
      author: raw.author.name,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt
    })
  }
}
