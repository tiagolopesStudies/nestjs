import { Injectable } from '@nestjs/common'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentRepository } from '@/domain/forum/application/repositories/answer-comment-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

@Injectable()
export class PrismaAnswerCommentRepository implements AnswerCommentRepository {
  create(comment: AnswerComment): Promise<void> {
    throw new Error('Method not implemented.')
  }
  findById(commentId: string): Promise<AnswerComment | null> {
    throw new Error('Method not implemented.')
  }
  findManyByAnswerId(
    answerId: string,
    params: PaginationParams
  ): Promise<AnswerComment[]> {
    throw new Error('Method not implemented.')
  }
  delete(comment: AnswerComment): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
