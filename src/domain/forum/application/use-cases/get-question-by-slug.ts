import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UseCaseError } from '@/core/errors/use-case-error'
import { QuestionDetails } from '../../enterprise/entities/value-objects/question-details'
import { QuestionRepository } from '../repositories/question-repository'

type GetQuestionBySlugUseCaseResponse = Either<
  UseCaseError,
  { question: QuestionDetails }
>

@Injectable()
export class GetQuestionBySlugUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute(slug: string): Promise<GetQuestionBySlugUseCaseResponse> {
    const question = await this.questionRepository.findDetailsBySlug(slug)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    return right({ question })
  }
}
