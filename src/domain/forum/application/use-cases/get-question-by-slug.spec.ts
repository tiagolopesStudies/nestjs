import { makeQuestion } from 'test/factories/make-question'
import { makeStudent } from 'test/factories/make-student'
import { InMemoryAttachmentRepository } from 'test/repositories/in-memory-attachment-repository'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachment-repository'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'

let inMemoryQuestionRepository: InMemoryQuestionRepository
let inMemoryStudentRepository: InMemoryStudentRepository

describe('Get question by slug', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository()
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      new InMemoryQuestionAttachmentRepository(),
      new InMemoryAttachmentRepository(),
      inMemoryStudentRepository
    )
  })

  it('should be able to get a question by slug', async () => {
    const sut = new GetQuestionBySlugUseCase(inMemoryQuestionRepository)

    const searchedSlug = Slug.create('example-slug')
    const author = makeStudent()

    await inMemoryStudentRepository.create(author)

    const newQuestion = makeQuestion({
      slug: searchedSlug,
      authorId: author.id
    })
    await inMemoryQuestionRepository.create(newQuestion)

    const result = await sut.execute(searchedSlug.value)

    if (!result.isRight()) return

    const { question } = result.value

    expect(question.slug?.value).toEqual(searchedSlug.value)
  })
})
