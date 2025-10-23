import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comment-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { InMemoryStudentRepository } from './in-memory-student-repository'

export class InMemoryQuestionCommentRepository
  implements QuestionCommentRepository
{
  public items: QuestionComment[] = []

  constructor(
    private readonly inMemoryStudentRepository: InMemoryStudentRepository
  ) {}

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

  async findManyWithAuthorByQuestionId(
    questionId: string,
    { page }: PaginationParams
  ): Promise<CommentWithAuthor[]> {
    return this.items
      .filter((item) => item.questionId.toString() === questionId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)
      .map((questionComment) => {
        const author = this.inMemoryStudentRepository.students.find((student) =>
          student.id.equals(questionComment.authorId)
        )

        if (!author) {
          throw new Error(
            `Author with id ${questionComment.authorId} not found.`
          )
        }

        return CommentWithAuthor.create({
          commentId: questionComment.id,
          content: questionComment.content,
          authorId: questionComment.authorId,
          author: author.name,
          createdAt: questionComment.createdAt,
          updatedAt: questionComment.updatedAt
        })
      })
  }
}
