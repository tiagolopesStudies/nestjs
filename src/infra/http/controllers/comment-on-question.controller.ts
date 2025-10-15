import {
  Body,
  Controller,
  NotFoundException,
  Param,
  Post
} from '@nestjs/common'
import z from 'zod'
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const commentOnQuestionBodySchema = z.object({
  content: z.string().min(1)
})

const questionIdParamSchema = z.uuid()

type CommentOnQuestionBodySchema = z.infer<typeof commentOnQuestionBodySchema>
type QuestionIdParamSchema = z.infer<typeof questionIdParamSchema>

const bodyValidationPipe = new ZodValidationPipe(commentOnQuestionBodySchema)
const paramsValidationPipe = new ZodValidationPipe(questionIdParamSchema)

@Controller('/questions/:questionId/comments')
export class CommentOnQuestionController {
  constructor(private readonly commentOnQuestion: CommentOnQuestionUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CommentOnQuestionBodySchema,
    @Param('questionId', paramsValidationPipe)
    questionId: QuestionIdParamSchema,
    @CurrentUser() user: UserPayload
  ) {
    const { content } = body
    const authorId = user.sub

    const result = await this.commentOnQuestion.execute({
      authorId,
      questionId,
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
