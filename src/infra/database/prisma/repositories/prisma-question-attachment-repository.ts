import { Injectable } from '@nestjs/common'
import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachment-repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { PrismaQuestionAttachmentMapper } from '../mappers/prisma-question-attachment-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaQuestionAttachmentRepository
  implements QuestionAttachmentRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  async createMany(questionAttachments: QuestionAttachment[]): Promise<void> {
    if (questionAttachments.length === 0) return

    const attachmentsId = questionAttachments.map(({ id }) => id.toString())
    const questionId = questionAttachments[0].questionId.toString()

    await this.prismaService.attachment.updateMany({
      where: {
        id: {
          in: attachmentsId
        }
      },
      data: {
        questionId
      }
    })
  }

  async deleteMany(questionAttachments: QuestionAttachment[]): Promise<void> {
    if (questionAttachments.length === 0) return

    const attachmentsId = questionAttachments.map(({ id }) => id.toString())

    await this.prismaService.attachment.deleteMany({
      where: { id: { in: attachmentsId } }
    })
  }

  async findManyByQuestionId(
    questionId: string
  ): Promise<QuestionAttachment[]> {
    const attachments = await this.prismaService.attachment.findMany({
      where: {
        questionId
      }
    })

    return attachments.map(PrismaQuestionAttachmentMapper.toDomain)
  }
  async deleteManyByQuestionId(questionId: string): Promise<void> {
    await this.prismaService.attachment.deleteMany({
      where: {
        questionId
      }
    })
  }
}
