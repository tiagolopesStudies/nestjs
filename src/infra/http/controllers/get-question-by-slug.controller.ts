import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UsePipes
} from '@nestjs/common'
import z from 'zod'
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { QuestionDetailsPresenter } from '../presenters/question-details-presenter'

const slugParamSchema = z.object({
  slug: z.string().min(1)
})

type SlugParamSchema = z.infer<typeof slugParamSchema>

const zodValidationPipe = new ZodValidationPipe(slugParamSchema)

@Controller('/questions/:slug')
export class GetQuestionBySlugController {
  constructor(private readonly getQuestionBySlug: GetQuestionBySlugUseCase) {}

  @Get()
  @UsePipes(zodValidationPipe)
  async handle(@Param() { slug }: SlugParamSchema) {
    const result = await this.getQuestionBySlug.execute(slug)

    if (result.isLeft()) {
      const error = result.value
      throw new NotFoundException(error.message)
    }

    const { question } = result.value

    return {
      question: QuestionDetailsPresenter.toHTTP(question)
    }
  }
}
