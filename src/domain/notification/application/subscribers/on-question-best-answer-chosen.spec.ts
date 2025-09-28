import { makeQuestion } from 'test/factories/make-question'
import { OnQuestionBestAnswerChosen } from './on-question-best-answer-chosen'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answer-repository'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachment-repository'
import { MockInstance } from 'vitest'

let answerRepository: InMemoryAnswerRepository
let questionRepository: InMemoryQuestionRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentRepository
let notificationsRepository: InMemoryNotificationsRepository
let sendNotification: SendNotificationUseCase
let sendNotificationExecuteSpy: MockInstance

describe('OnQuestionBestAnswerChosen', () => {
  beforeEach(() => {
    answerRepository = new InMemoryAnswerRepository()
    questionAttachmentsRepository = new InMemoryQuestionAttachmentRepository()
    questionRepository = new InMemoryQuestionRepository(
      questionAttachmentsRepository
    )
    notificationsRepository = new InMemoryNotificationsRepository()
    sendNotification = new SendNotificationUseCase(notificationsRepository)
    sendNotificationExecuteSpy = vi.spyOn(sendNotification, 'execute')

    new OnQuestionBestAnswerChosen(answerRepository, sendNotification)
  })

  it('should send a notification to the author of the best answer when a best answer is chosen', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({ questionId: question.id })

    await questionRepository.create(question)
    await answerRepository.create(answer)

    question.bestAnswerId = answer.id

    await questionRepository.save(question)

    expect(sendNotificationExecuteSpy).toHaveBeenCalled()
  })
})
