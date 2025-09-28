import { Injectable } from '@nestjs/common'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comment-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

@Injectable()
export class PrismaQuestionCommentRepository
  implements QuestionCommentRepository
{
  create(comment: QuestionComment): Promise<void> {
    throw new Error('Method not implemented.')
  }
  findById(commentId: string): Promise<QuestionComment | null> {
    throw new Error('Method not implemented.')
  }
  findManyByQuestionId(
    questionId: string,
    params: PaginationParams
  ): Promise<QuestionComment[]> {
    throw new Error('Method not implemented.')
  }
  delete(comment: QuestionComment): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
