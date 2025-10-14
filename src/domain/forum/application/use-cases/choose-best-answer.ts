import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UseCaseError } from '@/core/errors/use-case-error'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { AnswerRepository } from '../repositories/answer-repository'
import { QuestionRepository } from '../repositories/question-repository'

interface ChooseBestAnswerUseCaseRequest {
  answerId: string
  authorId: string
}

type ChooseBestAnswerUseCaseResponse = Either<
  UseCaseError,
  { question: Question }
>

@Injectable()
export class ChooseBestAnswerUseCase {
  constructor(
    private questionRepository: QuestionRepository,
    private answerRepository: AnswerRepository
  ) {}

  async execute({
    answerId,
    authorId
  }: ChooseBestAnswerUseCaseRequest): Promise<ChooseBestAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    const question = await this.questionRepository.findById(
      answer.questionId.toString()
    )

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (question.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    question.bestAnswerId = answer.id

    await this.questionRepository.save(question)

    return right({ question })
  }
}
