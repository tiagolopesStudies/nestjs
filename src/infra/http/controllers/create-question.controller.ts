import { Body, Controller, Post } from '@nestjs/common'
import { z } from 'zod'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

const createQuestionBodySchema = z.object({
  title: z.string().min(5).max(100),
  content: z.string().min(10).max(1000)
})

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>
const zodValidationPipe = new ZodValidationPipe(createQuestionBodySchema)

@Controller('/questions')
export class CreateQuestionController {
  constructor(private createQuestion: CreateQuestionUseCase) {}

  @Post()
  async handle(
    @Body(zodValidationPipe) body: CreateQuestionBodySchema,
    @CurrentUser() user: UserPayload
  ) {
    const { title, content } = body
    const userId = user.sub

    await this.createQuestion.execute({
      instructorId: userId,
      title,
      content,
      attachmentsIds: []
    })

    return {
      message: 'Question created successfully'
    }
  }
}
