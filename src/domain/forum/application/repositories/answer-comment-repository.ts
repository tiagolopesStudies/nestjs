import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author'

export abstract class AnswerCommentRepository {
  abstract create(comment: AnswerComment): Promise<void>
  abstract findById(commentId: string): Promise<AnswerComment | null>
  abstract findManyWithAuthorByAnswerId(
    answerId: string,
    params: PaginationParams
  ): Promise<CommentWithAuthor[]>
  abstract delete(comment: AnswerComment): Promise<void>
}
