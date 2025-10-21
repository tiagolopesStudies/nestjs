import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachment-repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

export class InMemoryQuestionAttachmentRepository
  implements QuestionAttachmentRepository
{
  public items: QuestionAttachment[] = []

  async createMany(questionAttachments: QuestionAttachment[]): Promise<void> {
    this.items.push(...questionAttachments)
  }

  async deleteMany(questionAttachments: QuestionAttachment[]): Promise<void> {
    const attachments = this.items.filter((item) => {
      return !questionAttachments.some((attachment) => attachment.equals(item))
    })

    this.items = attachments
  }

  async findManyByQuestionId(
    questionId: string
  ): Promise<QuestionAttachment[]> {
    return this.items.filter(
      (item) => item.questionId.toString() === questionId
    )
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    this.items = this.items.filter(
      (item) => item.questionId.toString() !== questionId
    )
  }
}
