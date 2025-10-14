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
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const questionParamSchema = z.object({
  id: z.uuid()
})

type QuestionParamSchema = z.infer<typeof questionParamSchema>

const paramValidationPipe = new ZodValidationPipe(questionParamSchema)

@Controller('/questions/:id')
export class DeleteQuestionController {
  constructor(private readonly deleteQuestion: DeleteQuestionUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param(paramValidationPipe) params: QuestionParamSchema,
    @CurrentUser() user: UserPayload
  ) {
    const userId = user.sub
    const questionId = params.id

    const result = await this.deleteQuestion.execute({
      questionId,
      authorId: userId
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
