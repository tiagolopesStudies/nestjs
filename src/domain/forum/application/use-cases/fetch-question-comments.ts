import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UseCaseError } from '@/core/errors/use-case-error'
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author'
import { QuestionCommentRepository } from '../repositories/question-comment-repository'
import { QuestionRepository } from '../repositories/question-repository'

interface FetchQuestionCommentsUseCaseRequest {
  questionId: string
  page: number
}

type FetchQuestionCommentsUseCaseResponse = Either<
  UseCaseError,
  { questionComments: CommentWithAuthor[] }
>

@Injectable()
export class FetchQuestionCommentsUseCase {
  constructor(
    private questionRepository: QuestionRepository,
    private questionCommentsRepository: QuestionCommentRepository
  ) {}

  async execute({
    questionId,
    page
  }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    const questionComments =
      await this.questionCommentsRepository.findManyWithAuthorByQuestionId(
        questionId,
        {
          page
        }
      )

    return right({ questionComments })
  }
}
