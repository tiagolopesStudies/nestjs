import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentRepository } from '@/domain/forum/application/repositories/answer-comment-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export class InMemoryAnswerCommentRepository
  implements AnswerCommentRepository
{
  comments: AnswerComment[] = []

  async create(comment: AnswerComment): Promise<void> {
    this.comments.push(comment)
  }

  async findById(commentId: string): Promise<AnswerComment | null> {
    const comment = this.comments.find(
      (item) => item.id.toString() === commentId
    )

    return comment ?? null
  }

  async delete(comment: AnswerComment): Promise<void> {
    const itemIndex = this.comments.findIndex(
      (item) => item.id.toString() === comment.id.toString()
    )

    this.comments.splice(itemIndex, 1)
  }

  async findManyByAnswerId(
    answerId: string,
    { page }: PaginationParams
  ): Promise<AnswerComment[]> {
    return this.comments
      .filter((item) => item.answerId.toString() === answerId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)
  }
}
