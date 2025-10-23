import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author'

export abstract class QuestionCommentRepository {
  abstract create(comment: QuestionComment): Promise<void>
  abstract findById(commentId: string): Promise<QuestionComment | null>
  abstract findManyWithAuthorByQuestionId(
    questionId: string,
    params: PaginationParams
  ): Promise<CommentWithAuthor[]>
  abstract delete(comment: QuestionComment): Promise<void>
}
