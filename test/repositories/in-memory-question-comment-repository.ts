import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comment-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

export class InMemoryQuestionCommentRepository
  implements QuestionCommentRepository
{
  public items: QuestionComment[] = []

  async create(comment: QuestionComment): Promise<void> {
    this.items.push(comment)
  }

  async findById(commentId: string): Promise<QuestionComment | null> {
    const comment = this.items.find((item) => item.id.toString() === commentId)

    return comment ?? null
  }

  async delete(comment: QuestionComment): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === comment.id.toString()
    )

    if (itemIndex === -1) return

    this.items.splice(itemIndex, 1)
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams
  ): Promise<QuestionComment[]> {
    return this.items
      .filter((item) => item.questionId.toString() === questionId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)
  }
}
