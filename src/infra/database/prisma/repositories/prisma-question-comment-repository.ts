import { Injectable } from '@nestjs/common'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comment-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { PrismaCommentWithAuthorMapper } from '../mappers/prisma-comment-with-author-mapper'
import { PrismaQuestionCommentMapper } from '../mappers/prisma-question-comment.mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaQuestionCommentRepository
  implements QuestionCommentRepository
{
  constructor(private prismaService: PrismaService) {}

  async create(comment: QuestionComment): Promise<void> {
    await this.prismaService.comment.create({
      data: PrismaQuestionCommentMapper.toPrisma(comment)
    })
  }

  async findById(commentId: string): Promise<QuestionComment | null> {
    const comment = await this.prismaService.comment.findUnique({
      where: {
        id: commentId
      }
    })

    return comment ? PrismaQuestionCommentMapper.toDomain(comment) : null
  }

  async findManyWithAuthorByQuestionId(
    questionId: string,
    params: PaginationParams
  ): Promise<CommentWithAuthor[]> {
    const QuestionComments = await this.prismaService.comment.findMany({
      where: {
        questionId
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

    return QuestionComments.map(PrismaCommentWithAuthorMapper.toDomain)
  }

  async delete(comment: QuestionComment): Promise<void> {
    await this.prismaService.comment.delete({
      where: {
        id: comment.id.toString()
      }
    })
  }
}
