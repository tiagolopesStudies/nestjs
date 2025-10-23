import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author'
import { AnswerCommentRepository } from '../repositories/answer-comment-repository'
import { AnswerRepository } from '../repositories/answer-repository'

interface FetchAnswerCommentsUseCaseRequest {
  answerId: string
  page: number
}

type FetchAnswerCommentsUseCaseResponse = Either<
  ResourceNotFoundError,
  { answerComments: CommentWithAuthor[] }
>

@Injectable()
export class FetchAnswerCommentsUseCase {
  constructor(
    private answerRepository: AnswerRepository,
    private answerCommentsRepository: AnswerCommentRepository
  ) {}

  async execute({
    answerId,
    page
  }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    const answerComments =
      await this.answerCommentsRepository.findManyWithAuthorByAnswerId(
        answerId,
        {
          page
        }
      )

    return right({ answerComments })
  }
}
