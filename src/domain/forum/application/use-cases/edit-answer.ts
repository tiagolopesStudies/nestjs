import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UseCaseError } from '@/core/errors/use-case-error'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { AnswerRepository } from '../repositories/answer-repository'

interface EditAnswerUseCaseRequest {
  answerId: string
  authorId: string
  content: string
}

type EditAnswerUseCaseResponse = Either<UseCaseError, { answer: Answer }>

@Injectable()
export class EditAnswerUseCase {
  constructor(private answerRepository: AnswerRepository) {}
  async execute({
    answerId,
    authorId,
    content
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (answer.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    answer.content = content

    this.answerRepository.save(answer)

    return right({ answer })
  }
}
