import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answer-repository'
import { makeInMemoryQuestionRepository } from 'test/factories/make-in-memory-question-repository'
import { UniqueEntityId } from '../../enterprise/entities/value-objects/unique-entity-id'
import { AnswerRepository } from '../repositories/answer-repository'
import { QuestionRepository } from '../repositories/question-repository'
import { ChooseBestAnswerUseCase } from './choose-best-answer'
import { makeQuestion } from 'test/factories/make-question'
import { makeAnswer } from 'test/factories/make-answer'
import { NotAllowedError } from '../../../../core/errors/not-allowed-error'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found-error'

let answerRepository: AnswerRepository
let questionRepository: QuestionRepository
let sut: ChooseBestAnswerUseCase

describe('Choose best answer for question', () => {
  beforeEach(() => {
    answerRepository = new InMemoryAnswerRepository()
    questionRepository = makeInMemoryQuestionRepository()
    sut = new ChooseBestAnswerUseCase(questionRepository, answerRepository)
  })

  it('should be able to choose the best answer for question', async () => {
    const question = makeQuestion()
    await questionRepository.create(question)

    const answer = makeAnswer({ questionId: question.id })
    await answerRepository.create(answer)

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: question.authorId.toString()
    })

    if (!result.isRight()) return

    expect(result.isRight()).toBe(true)
    expect(result.value.question.bestAnswerId).toEqual(answer.id)
  })

  it('should not be able to choose the best answer for question from another user', async () => {
    const question = makeQuestion({ authorId: new UniqueEntityId('user-id') })
    await questionRepository.create(question)

    const answer = makeAnswer({ questionId: question.id })
    await answerRepository.create(answer)

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: 'another-user-id'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to choose an inexistent answer', async () => {
    const question = makeQuestion()
    await questionRepository.create(question)

    const result = await sut.execute({
      answerId: '1234',
      authorId: question.authorId.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to choose an answer from inexistent question', async () => {
    const answer = makeAnswer()
    await answerRepository.create(answer)

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: '1234'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
