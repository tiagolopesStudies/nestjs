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
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const editQuestionBodySchema = z.object({
  title: z.string().min(5).max(100),
  content: z.string().min(10).max(1000)
})

const editQuestionParamSchema = z.object({
  id: z.uuid()
})

type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>
type EditQuestionParamSchema = z.infer<typeof editQuestionParamSchema>

const bodyValidationPipe = new ZodValidationPipe(editQuestionBodySchema)
const paramValidationPipe = new ZodValidationPipe(editQuestionParamSchema)

@Controller('/questions/:id')
export class EditQuestionController {
  constructor(private readonly editQuestion: EditQuestionUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditQuestionBodySchema,
    @CurrentUser() user: UserPayload,
    @Param(paramValidationPipe) { id: questionId }: EditQuestionParamSchema
  ) {
    const { title, content } = body

    const result = await this.editQuestion.execute({
      authorId: user.sub,
      title,
      content,
      attachmentsIds: [],
      questionId
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
