import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentRepository } from '@/domain/forum/application/repositories/answer-comment-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { InMemoryStudentRepository } from './in-memory-student-repository'

export class InMemoryAnswerCommentRepository
  implements AnswerCommentRepository
{
  comments: AnswerComment[] = []

  constructor(private readonly studentRepository: InMemoryStudentRepository) {}

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

  async findManyWithAuthorByAnswerId(
    answerId: string,
    { page }: PaginationParams
  ): Promise<CommentWithAuthor[]> {
    return this.comments
      .filter((item) => item.answerId.toString() === answerId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)
      .map((answerComment) => {
        const author = this.studentRepository.students.find((student) =>
          student.id.equals(answerComment.authorId)
        )

        if (!author) {
          throw new Error(`Author with id ${answerComment.authorId} not found.`)
        }

        return CommentWithAuthor.create({
          commentId: answerComment.id,
          content: answerComment.content,
          authorId: answerComment.authorId,
          author: author.name,
          createdAt: answerComment.createdAt,
          updatedAt: answerComment.updatedAt
        })
      })
  }
}
