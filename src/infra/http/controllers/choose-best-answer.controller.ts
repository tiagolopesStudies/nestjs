import {
  BadRequestException,
  Controller,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
  Patch
} from '@nestjs/common'
import z from 'zod'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { ChooseBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-best-answer'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const answerIdParamSchema = z.uuid()

type AnswerIdParamsSchema = z.infer<typeof answerIdParamSchema>

const paramsValidationPipe = new ZodValidationPipe(answerIdParamSchema)

@Controller('/answers/:answerId/choose-as-best')
export class ChooseBestAnswerController {
  constructor(private readonly chooseBestAnswer: ChooseBestAnswerUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Param('answerId', paramsValidationPipe) answerId: AnswerIdParamsSchema,
    @CurrentUser() user: UserPayload
  ) {
    const authorId = user.sub

    const result = await this.chooseBestAnswer.execute({
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
