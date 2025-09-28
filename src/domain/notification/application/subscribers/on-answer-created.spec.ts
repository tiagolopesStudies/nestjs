import { makeAnswer } from 'test/factories/make-answer'
import { OnAnswerCreated } from './on-answer-created'
import { AnswerRepository } from '@/domain/forum/application/repositories/answer-repository'
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answer-repository'
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository'
import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachment-repository'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachment-repository'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { NotificationsRepository } from '../repositories/notifications-repository'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { makeQuestion } from 'test/factories/make-question'
import { MockInstance } from 'vitest'

let answerRepository: AnswerRepository
let questionRepository: QuestionRepository
let questionAttachmentsRepository: QuestionAttachmentRepository
let notificationsRepository: NotificationsRepository
let sendNotification: SendNotificationUseCase
let sendNotificationExecuteSpy: MockInstance

describe('On Answer Created', () => {
  beforeEach(() => {
    answerRepository = new InMemoryAnswerRepository()
    questionAttachmentsRepository = new InMemoryQuestionAttachmentRepository()
    questionRepository = new InMemoryQuestionRepository(
      questionAttachmentsRepository
    )
    notificationsRepository = new InMemoryNotificationsRepository()
    sendNotification = new SendNotificationUseCase(notificationsRepository)

    sendNotificationExecuteSpy = vi.spyOn(sendNotification, 'execute')

    new OnAnswerCreated(questionRepository, sendNotification)
  })

  it('should send a notification when an answer is created', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({ questionId: question.id })

    await questionRepository.create(question)
    await answerRepository.create(answer)

    expect(sendNotificationExecuteSpy).toHaveBeenCalled()
  })
})
