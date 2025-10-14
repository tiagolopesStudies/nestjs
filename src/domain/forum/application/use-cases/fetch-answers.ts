import { Injectable } from '@nestjs/common'
import { Either, right } from '@/core/either'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { AnswerRepository } from '../repositories/answer-repository'

interface FetchAnswersUseCaseRequest {
  questionId: string
  page: number
}

type FetchAnswersUseCaseResponse = Either<null, { answers: Answer[] }>

@Injectable()
export class FetchAnswersUseCase {
  constructor(private answerRepository: AnswerRepository) {}

  async execute({
    questionId,
    page
  }: FetchAnswersUseCaseRequest): Promise<FetchAnswersUseCaseResponse> {
    const answers = await this.answerRepository.findManyByQuestionId(
      questionId,
      { page }
    )

    return right({ answers })
  }
}
