import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query
} from '@nestjs/common'
import z from 'zod'
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { AnswerCommentPresenter } from '../presenters/answer-comment-presenter'

const answerIdParamSchema = z.uuid()
const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

type AnswerIdParamSchema = z.infer<typeof answerIdParamSchema>
type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

const answerIdValidationPipe = new ZodValidationPipe(answerIdParamSchema)
const pageValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {
  constructor(
    private readonly fetchAnswerComments: FetchAnswerCommentsUseCase
  ) {}

  @Get()
  async handle(
    @Param('answerId', answerIdValidationPipe) answerId: AnswerIdParamSchema,
    @Query('page', pageValidationPipe) page: PageQueryParamSchema
  ) {
    const result = await this.fetchAnswerComments.execute({ answerId, page })

    if (result.isLeft()) {
      const error = result.value

      throw new NotFoundException(error.message)
    }

    const { answerComments } = result.value

    return {
      comments: answerComments.map(AnswerCommentPresenter.toHTTP)
    }
  }
}
