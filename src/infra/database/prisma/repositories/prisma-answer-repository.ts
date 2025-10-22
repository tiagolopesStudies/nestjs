import { Injectable } from '@nestjs/common'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerAttachmentRepository } from '@/domain/forum/application/repositories/answer-attachment-repository'
import { AnswerRepository } from '@/domain/forum/application/repositories/answer-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { PrismaAnswerMapper } from '../mappers/prisma-answer-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAnswerRepository implements AnswerRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly answerAttachmentRepository: AnswerAttachmentRepository
  ) {}

  async create(answer: Answer): Promise<void> {
    await this.prismaService.answer.create({
      data: PrismaAnswerMapper.toPrisma(answer)
    })

    await this.answerAttachmentRepository.createMany(
      answer.attachments.getItems()
    )
  }

  async save(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer)

    await this.prismaService.answer.update({
      where: {
        id: answer.id.toString()
      },
      data
    })

    await this.answerAttachmentRepository.createMany(
      answer.attachments.getNewItems()
    )
    await this.answerAttachmentRepository.deleteMany(
      answer.attachments.getRemovedItems()
    )
  }

  async findById(answerId: string): Promise<Answer | null> {
    const answer = await this.prismaService.answer.findUnique({
      where: {
        id: answerId
      }
    })

    if (!answer) {
      return null
    }

    return PrismaAnswerMapper.toDomain(answer)
  }

  async findManyByQuestionId(
    questionId: string,
    params: PaginationParams
  ): Promise<Answer[]> {
    const answers = await this.prismaService.answer.findMany({
      where: {
        questionId
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20,
      skip: (params.page - 1) * 20
    })

    return answers.map(PrismaAnswerMapper.toDomain)
  }

  async delete(answer: Answer): Promise<void> {
    await this.prismaService.answer.delete({
      where: {
        id: answer.id.toString()
      }
    })
  }
}
