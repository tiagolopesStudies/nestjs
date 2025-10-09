import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { UseCaseError } from '@/core/errors/use-case-error'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found-error'
import { Question } from '../../enterprise/entities/question'
import { QuestionRepository } from '../repositories/question-repository'

type GetQuestionBySlugUseCaseResponse = Either<
  UseCaseError,
  { question: Question }
>

@Injectable()
export class GetQuestionBySlugUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute(slug: string): Promise<GetQuestionBySlugUseCaseResponse> {
    const question = await this.questionRepository.findBySlug(slug)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    return right({ question })
  }
}
