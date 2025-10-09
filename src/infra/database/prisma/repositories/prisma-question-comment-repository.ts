import { Injectable } from '@nestjs/common'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comment-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
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

  async findManyByQuestionId(
    questionId: string,
    params: PaginationParams
  ): Promise<QuestionComment[]> {
    const QuestionComments = await this.prismaService.comment.findMany({
      where: {
        questionId
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20,
      skip: (params.page - 1) * 20
    })

    return QuestionComments.map(PrismaQuestionCommentMapper.toDomain)
  }

  async delete(comment: QuestionComment): Promise<void> {
    await this.prismaService.comment.delete({
      where: {
        id: comment.id.toString()
      }
    })
  }
}
