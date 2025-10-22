import { AnswerAttachmentRepository } from '@/domain/forum/application/repositories/answer-attachment-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

export class InMemoryAnswerAttachmentRepository
  implements AnswerAttachmentRepository
{
  public items: AnswerAttachment[] = []

  async createMany(answerAttachments: AnswerAttachment[]): Promise<void> {
    this.items.push(...answerAttachments)
  }

  async deleteMany(answerAttachments: AnswerAttachment[]): Promise<void> {
    const attachments = this.items.filter((item) => {
      return !answerAttachments.some((attachment) => attachment.equals(item))
    })

    this.items = attachments
  }

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    return this.items.filter((item) => item.answerId.toString() === answerId)
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    this.items = this.items.filter(
      (item) => item.answerId.toString() !== answerId
    )
  }
}
