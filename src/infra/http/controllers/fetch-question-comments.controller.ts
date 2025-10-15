import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query
} from '@nestjs/common'
import z from 'zod'
import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { QuestionCommentPresenter } from '../presenters/question-comment-presenter'

const questionIdParamSchema = z.uuid()
const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

type QuestionIdParamSchema = z.infer<typeof questionIdParamSchema>
type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

const questionIdValidationPipe = new ZodValidationPipe(questionIdParamSchema)
const pageValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller('/questions/:questionId/comments')
export class FetchQuestionCommentsController {
  constructor(
    private readonly fetchQuestionComments: FetchQuestionCommentsUseCase
  ) {}

  @Get()
  async handle(
    @Param('questionId', questionIdValidationPipe)
    questionId: QuestionIdParamSchema,
    @Query('page', pageValidationPipe) page: PageQueryParamSchema
  ) {
    const result = await this.fetchQuestionComments.execute({
      questionId,
      page
    })

    if (result.isLeft()) {
      const error = result.value

      throw new NotFoundException(error.message)
    }

    const { questionComments } = result.value

    return {
      comments: questionComments.map(QuestionCommentPresenter.toHTTP)
    }
  }
}
