import {
  Body,
  Controller,
  NotFoundException,
  Param,
  Post
} from '@nestjs/common'
import z from 'zod'
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const commentOnAnswerBodySchema = z.object({
  content: z.string().min(1)
})

const answerIdParamSchema = z.uuid()

type CommentOnAnswerBodySchema = z.infer<typeof commentOnAnswerBodySchema>
type AnswerIdParamSchema = z.infer<typeof answerIdParamSchema>

const bodyValidationPipe = new ZodValidationPipe(commentOnAnswerBodySchema)
const paramValidationPipe = new ZodValidationPipe(answerIdParamSchema)

@Controller('/answers/:answerId/comments')
export class CommentOnAnswerController {
  constructor(private readonly commentOnAnswer: CommentOnAnswerUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CommentOnAnswerBodySchema,
    @Param('answerId', paramValidationPipe) answerId: AnswerIdParamSchema,
    @CurrentUser() user: UserPayload
  ) {
    const { content } = body
    const authorId = user.sub

    const result = await this.commentOnAnswer.execute({
      answerId,
      authorId,
      content
    })

    if (result.isLeft()) {
      const error = result.value
      throw new NotFoundException(error.message)
    }

    return {
      message: 'Comment created successfully'
    }
  }
}
