import { Injectable } from '@nestjs/common'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentRepository } from '@/domain/forum/application/repositories/answer-comment-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { PrismaAnswerCommentMapper } from '../mappers/prisma-answer-comment-mapper'
import { PrismaCommentWithAuthorMapper } from '../mappers/prisma-comment-with-author-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAnswerCommentRepository implements AnswerCommentRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(comment: AnswerComment): Promise<void> {
    await this.prismaService.comment.create({
      data: PrismaAnswerCommentMapper.toPrisma(comment)
    })
  }
  async findById(commentId: string): Promise<AnswerComment | null> {
    const comment = await this.prismaService.comment.findUnique({
      where: {
        id: commentId
      }
    })

    if (!comment) {
      return null
    }

    return PrismaAnswerCommentMapper.toDomain(comment)
  }
  async findManyWithAuthorByAnswerId(
    answerId: string,
    params: PaginationParams
  ): Promise<CommentWithAuthor[]> {
    const comments = await this.prismaService.comment.findMany({
      where: {
        answerId
      },
      include: {
        author: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20,
      skip: (params.page - 1) * 20
    })

    return comments.map(PrismaCommentWithAuthorMapper.toDomain)
  }

  async delete(comment: AnswerComment): Promise<void> {
    await this.prismaService.comment.delete({
      where: {
        id: comment.id.toString()
      }
    })
  }
}
