import { makeQuestion } from 'test/factories/make-question'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { makeStudent } from 'test/factories/make-student'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachment-repository'
import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comment-repository'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'
import { QuestionCommentRepository } from '../repositories/question-comment-repository'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'

let sut: FetchQuestionCommentsUseCase
let questionRepository: InMemoryQuestionRepository
let questionCommentsRepository: QuestionCommentRepository
let studentRepository: InMemoryStudentRepository

describe('Comment on question', () => {
  beforeEach(() => {
    questionRepository = new InMemoryQuestionRepository(
      new InMemoryQuestionAttachmentRepository()
    )
    studentRepository = new InMemoryStudentRepository()
    questionCommentsRepository = new InMemoryQuestionCommentRepository(
      studentRepository
    )

    sut = new FetchQuestionCommentsUseCase(
      questionRepository,
      questionCommentsRepository
    )
  })

  it('should be able to fetch comments on question', async () => {
    const question = makeQuestion()
    await questionRepository.create(question)

    const student = makeStudent()
    await studentRepository.create(student)

    await questionCommentsRepository.create(
      makeQuestionComment({
        authorId: student.id,
        questionId: question.id,
        createdAt: new Date('2025-05-01')
      })
    )

    await questionCommentsRepository.create(
      makeQuestionComment({
        authorId: student.id,
        questionId: question.id,
        createdAt: new Date('2025-05-10')
      })
    )

    await questionCommentsRepository.create(
      makeQuestionComment({
        authorId: student.id,
        questionId: question.id,
        createdAt: new Date('2025-05-06')
      })
    )

    const result = await sut.execute({
      questionId: question.id.toString(),
      page: 1
    })

    if (!result.isRight()) throw new Error()

    const { questionComments } = result.value

    expect(questionComments).toHaveLength(3)
    expect(questionComments).toEqual([
      expect.objectContaining({ createdAt: new Date('2025-05-01') }),
      expect.objectContaining({ createdAt: new Date('2025-05-06') }),
      expect.objectContaining({ createdAt: new Date('2025-05-10') })
    ])
  })

  it('should be able to fetch paginated comments on question', async () => {
    const question = makeQuestion()
    await questionRepository.create(question)

    const student = makeStudent()
    await studentRepository.create(student)

    for (let i = 1; i <= 22; i++) {
      await questionCommentsRepository.create(
        makeQuestionComment({ questionId: question.id, authorId: student.id })
      )
    }

    const result = await sut.execute({
      questionId: question.id.toString(),
      page: 2
    })

    if (!result.isRight()) throw new Error()

    const { questionComments } = result.value

    expect(questionComments).toHaveLength(2)
  })
})
