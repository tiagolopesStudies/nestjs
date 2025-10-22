import { Body, Controller, Param, Post } from '@nestjs/common'
import z from 'zod'
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'
import { UniqueEntityId } from '@/domain/forum/enterprise/entities/value-objects/unique-entity-id'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const answerQuestionBodySchema = z.object({
  content: z.string().min(1),
  attachments: z.array(z.uuid()).default([])
})

const answerQuestionParamsSchema = z.object({
  questionId: z.uuid()
})

type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>
type AnswerQuestionParamsSchema = z.infer<typeof answerQuestionParamsSchema>

const bodyValidationPipe = new ZodValidationPipe(answerQuestionBodySchema)
const paramsValidationPipe = new ZodValidationPipe(answerQuestionParamsSchema)

@Controller('/questions/:questionId/answers')
export class AnswerQuestionController {
  constructor(private readonly answerQuestion: AnswerQuestionUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: AnswerQuestionBodySchema,
    @Param(paramsValidationPipe) params: AnswerQuestionParamsSchema,
    @CurrentUser() user: UserPayload
  ) {
    const { content, attachments } = body
    const { questionId } = params
    const authorId = user.sub

    await this.answerQuestion.execute({
      authorId: new UniqueEntityId(authorId),
      questionId: new UniqueEntityId(questionId),
      content: content,
      attachmentIds: attachments
    })

    return {
      message: 'Answer created successfully'
    }
  }
}
