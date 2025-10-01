import { Injectable } from '@nestjs/common'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaQuestionRepository implements QuestionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)

    await this.prisma.question.create({
      data
    })
  }
  async save(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)

    await this.prisma.question.update({
      where: {
        id: question.id.toString()
      },
      data
    })
  }
  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        slug
      }
    })

    if (!question) {
      return null
    }

    return PrismaQuestionMapper.toDomain(question)
  }
  async findById(questionId: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        id: questionId
      }
    })

    if (!question) {
      return null
    }

    return PrismaQuestionMapper.toDomain(question)
  }
  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const perPage = 20

    const questions = await this.prisma.question.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      skip: (page - 1) * perPage,
      take: perPage
    })

    return questions.map(PrismaQuestionMapper.toDomain)
  }
  async delete(question: Question): Promise<void> {
    await this.prisma.question.delete({
      where: {
        id: question.id.toString()
      }
    })
  }
}
