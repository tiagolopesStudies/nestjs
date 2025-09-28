import { Either, left, right } from '@/core/either'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { UniqueEntityId } from '../../enterprise/entities/value-objects/unique-entity-id'
import { AnswerCommentRepository } from '../repositories/answer-comment-repository'
import { AnswerRepository } from '../repositories/answer-repository'
import { UseCaseError } from '@/core/errors/use-case-error'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found-error'

interface CommentOnAnswerUseCaseRequest {
  answerId: string
  authorId: string
  content: string
}

type CommentOnAnswerUseCaseResponse = Either<
  UseCaseError,
  { answerComment: AnswerComment }
>

export class CommentOnAnswerUseCase {
  constructor(
    private answerRepository: AnswerRepository,
    private questionCommentRepository: AnswerCommentRepository
  ) {}

  async execute({
    answerId,
    authorId,
    content
  }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    const answerComment = AnswerComment.create({
      answerId: new UniqueEntityId(answerId),
      authorId: new UniqueEntityId(authorId),
      content
    })

    await this.questionCommentRepository.create(answerComment)

    return right({ answerComment })
  }
}
