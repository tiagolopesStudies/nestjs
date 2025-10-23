import { makeAnswer } from 'test/factories/make-answer'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answer-repository'
import { InMemoryAttachmentRepository } from 'test/repositories/in-memory-attachment-repository'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachment-repository'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'
import { MockInstance } from 'vitest'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { OnQuestionBestAnswerChosen } from './on-question-best-answer-chosen'

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
      questionAttachmentsRepository,
      new InMemoryAttachmentRepository(),
      new InMemoryStudentRepository()
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
