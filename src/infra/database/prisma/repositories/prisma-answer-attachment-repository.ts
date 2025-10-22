import { Injectable } from '@nestjs/common'
import { AnswerAttachmentRepository } from '@/domain/forum/application/repositories/answer-attachment-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { PrismaAnswerAttachmentMapper } from '../mappers/prisma-answer-attachment-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAnswerAttachmentRepository
  implements AnswerAttachmentRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  async createMany(answerAttachments: AnswerAttachment[]): Promise<void> {
    if (answerAttachments.length === 0) return

    const attachmentsId = answerAttachments.map(({ attachmentId }) =>
      attachmentId.toString()
    )
    const answerId = answerAttachments[0].answerId.toString()

    await this.prismaService.attachment.updateMany({
      where: {
        id: {
          in: attachmentsId
        }
      },
      data: {
        answerId
      }
    })
  }

  async deleteMany(answerAttachments: AnswerAttachment[]): Promise<void> {
    if (answerAttachments.length === 0) return

    const attachmentsId = answerAttachments.map(({ attachmentId }) =>
      attachmentId.toString()
    )

    await this.prismaService.attachment.deleteMany({
      where: {
        id: {
          in: attachmentsId
        }
      }
    })
  }

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const attachments = await this.prismaService.attachment.findMany({
      where: {
        answerId
      }
    })

    return attachments.map(PrismaAnswerAttachmentMapper.toDomain)
  }
  async deleteManyByAnswerId(answerId: string): Promise<void> {
    await this.prismaService.attachment.deleteMany({
      where: {
        answerId
      }
    })
  }
}
