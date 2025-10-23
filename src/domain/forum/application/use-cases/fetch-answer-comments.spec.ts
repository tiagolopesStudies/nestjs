import { makeAnswer } from 'test/factories/make-answer'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { makeStudent } from 'test/factories/make-student'
import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-comment-repository'
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answer-repository'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'

let sut: FetchAnswerCommentsUseCase
let answerRepository: InMemoryAnswerRepository
let studentRepository: InMemoryStudentRepository
let answerCommentsRepository: InMemoryAnswerCommentRepository

describe('Comment on answer', () => {
  beforeEach(() => {
    answerRepository = new InMemoryAnswerRepository()
    studentRepository = new InMemoryStudentRepository()
    answerCommentsRepository = new InMemoryAnswerCommentRepository(
      studentRepository
    )

    sut = new FetchAnswerCommentsUseCase(
      answerRepository,
      answerCommentsRepository
    )
  })

  it('should be able to fetch comments on answer', async () => {
    const answer = makeAnswer()
    await answerRepository.create(answer)

    const student = makeStudent()
    await studentRepository.create(student)

    await answerCommentsRepository.create(
      makeAnswerComment({
        answerId: answer.id,
        authorId: student.id,
        createdAt: new Date('2025-05-01')
      })
    )

    await answerCommentsRepository.create(
      makeAnswerComment({
        answerId: answer.id,
        authorId: student.id,
        createdAt: new Date('2025-05-10')
      })
    )

    await answerCommentsRepository.create(
      makeAnswerComment({
        answerId: answer.id,
        authorId: student.id,
        createdAt: new Date('2025-05-06')
      })
    )

    const result = await sut.execute({
      answerId: answer.id.toString(),
      page: 1
    })

    if (!result.isRight()) throw new Error()

    const { answerComments } = result.value

    expect(answerComments).toHaveLength(3)
    expect(answerComments).toEqual([
      expect.objectContaining({ createdAt: new Date('2025-05-01') }),
      expect.objectContaining({ createdAt: new Date('2025-05-06') }),
      expect.objectContaining({ createdAt: new Date('2025-05-10') })
    ])
  })

  it('should be able to fetch paginated comments on answer', async () => {
    const answer = makeAnswer()
    await answerRepository.create(answer)

    const student = makeStudent()
    await studentRepository.create(student)

    for (let i = 1; i <= 22; i++) {
      await answerCommentsRepository.create(
        makeAnswerComment({ answerId: answer.id, authorId: student.id })
      )
    }

    const result = await sut.execute({
      answerId: answer.id.toString(),
      page: 2
    })

    if (!result.isRight()) return

    const { answerComments } = result.value

    expect(answerComments).toHaveLength(2)
  })
})
