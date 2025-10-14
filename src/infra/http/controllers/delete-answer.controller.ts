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
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const deleteAnswerParamsSchema = z.object({
  answerId: z.uuid()
})

type DeleteAnswerParams = z.infer<typeof deleteAnswerParamsSchema>

const paramsValidationPipe = new ZodValidationPipe(deleteAnswerParamsSchema)

@Controller('/answers/:answerId')
export class DeleteAnswerController {
  constructor(private readonly deleteAnswer: DeleteAnswerUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param(paramsValidationPipe) params: DeleteAnswerParams,
    @CurrentUser() user: UserPayload
  ) {
    const authorId = user.sub
    const { answerId } = params

    const result = await this.deleteAnswer.execute({
      answerId,
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
