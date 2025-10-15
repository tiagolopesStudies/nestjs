import {
  BadRequestException,
  Controller,
  Delete,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param
} from '@nestjs/common'
import z from 'zod'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const commentIdParamSchema = z.uuid()
type CommentIdParamSchema = z.infer<typeof commentIdParamSchema>
const paramsValidationPipe = new ZodValidationPipe(commentIdParamSchema)

@Controller('/answers/comments/:commentId')
export class DeleteAnswerCommentController {
  constructor(
    private readonly deleteAnswerComment: DeleteAnswerCommentUseCase
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param('commentId', paramsValidationPipe) commentId: CommentIdParamSchema,
    @CurrentUser() user: UserPayload
  ) {
    const authorId = user.sub

    const result = await this.deleteAnswerComment.execute({
      answerCommentId: commentId,
      authorId
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case NotAllowedError:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
