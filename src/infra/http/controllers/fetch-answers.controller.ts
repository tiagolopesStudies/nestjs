import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query
} from '@nestjs/common'
import z from 'zod'
import { FetchAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-answers'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { AnswerPresenter } from '../presenters/answer-presenter'

const questionIdParamsSchema = z.uuid()

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

type QuestionIdParamsSchema = z.infer<typeof questionIdParamsSchema>

const paramsValidationPipe = new ZodValidationPipe(questionIdParamsSchema)
const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller('/questions/:questionId/answers')
export class FetchAnswersController {
  constructor(private readonly fetchAnswers: FetchAnswersUseCase) {}

  @Get()
  async handle(
    @Param('questionId', paramsValidationPipe)
    questionId: QuestionIdParamsSchema,
    @Query('page', queryValidationPipe) page: number
  ) {
    const result = await this.fetchAnswers.execute({ questionId, page })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { answers } = result.value

    return {
      answers: answers.map(AnswerPresenter.toHTTP)
    }
  }
}
