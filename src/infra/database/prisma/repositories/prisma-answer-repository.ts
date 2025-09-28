import { Injectable } from '@nestjs/common'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerRepository } from '@/domain/forum/application/repositories/answer-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

@Injectable()
export class PrismaAnswerRepository implements AnswerRepository {
  create(answer: Answer): Promise<void> {
    throw new Error('Method not implemented.')
  }
  save(answer: Answer): Promise<void> {
    throw new Error('Method not implemented.')
  }
  findById(answerId: string): Promise<Answer | null> {
    throw new Error('Method not implemented.')
  }
  findManyByQuestionId(
    questionId: string,
    params: PaginationParams
  ): Promise<Answer[]> {
    throw new Error('Method not implemented.')
  }
  delete(answer: Answer): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
