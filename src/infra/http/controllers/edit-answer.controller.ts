import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
  Put
} from '@nestjs/common'
import z from 'zod'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const editAnswerBodySchema = z.object({
  content: z.string().min(1)
})

const editAnswerParamsSchema = z.object({
  answerId: z.uuid()
})

type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>
type EditAnswerParamsSchema = z.infer<typeof editAnswerParamsSchema>

const bodyValidationPipe = new ZodValidationPipe(editAnswerBodySchema)
const paramsValidationPipe = new ZodValidationPipe(editAnswerParamsSchema)

@Controller('/answers/:answerId')
export class EditAnswerController {
  constructor(private readonly editAnswer: EditAnswerUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditAnswerBodySchema,
    @Param(paramsValidationPipe) params: EditAnswerParamsSchema,
    @CurrentUser() user: UserPayload
  ) {
    const { answerId } = params
    const { content } = body
    const authorId = user.sub

    const result = await this.editAnswer.execute({
      answerId,
      authorId,
      content
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
