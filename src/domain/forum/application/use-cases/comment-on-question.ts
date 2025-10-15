import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UseCaseError } from '@/core/errors/use-case-error'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { UniqueEntityId } from '@/domain/forum/enterprise/entities/value-objects/unique-entity-id'
import { QuestionCommentRepository } from '../repositories/question-comment-repository'
import { QuestionRepository } from '../repositories/question-repository'

interface CommentOnQuestionUseCaseRequest {
  questionId: string
  authorId: string
  content: string
}

type CommentOnQuestionUseCaseResponse = Either<
  UseCaseError,
  { questionComment: QuestionComment }
>

@Injectable()
export class CommentOnQuestionUseCase {
  constructor(
    private questionRepository: QuestionRepository,
    private questionCommentsRepository: QuestionCommentRepository
  ) {}

  async execute({
    questionId,
    authorId,
    content
  }: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    const questionComment = QuestionComment.create({
      questionId: new UniqueEntityId(questionId),
      authorId: new UniqueEntityId(authorId),
      content
    })

    await this.questionCommentsRepository.create(questionComment)

    return right({ questionComment })
  }
}
