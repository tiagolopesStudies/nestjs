import { makeInMemoryQuestionRepository } from 'test/factories/make-in-memory-question-repository'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { QuestionRepository } from '../repositories/question-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { makeQuestion } from 'test/factories/make-question'

let inMemoryQuestionRepository: QuestionRepository

describe('Get question by slug', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = makeInMemoryQuestionRepository()
  })

  it('should be able to get a question by slug', async () => {
    const sut = new GetQuestionBySlugUseCase(inMemoryQuestionRepository)

    const searchedSlug = Slug.create('example-slug')
    const newQuestion = makeQuestion({ slug: searchedSlug })
    await inMemoryQuestionRepository.create(newQuestion)

    const result = await sut.execute(searchedSlug.value)

    if (!result.isRight()) return

    const { question } = result.value

    expect(question.slug?.value).toEqual(searchedSlug.value)
  })
})
