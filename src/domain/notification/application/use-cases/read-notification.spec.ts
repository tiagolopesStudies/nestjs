import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { NotificationsRepository } from '../repositories/notifications-repository'
import { ReadNotificationUseCase } from './read-notification'
import { makeNotification } from 'test/factories/make-notification'

let notificationsRepository: NotificationsRepository
let sut: ReadNotificationUseCase

describe('Send notification', () => {
  beforeEach(() => {
    notificationsRepository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCase(notificationsRepository)
  })

  it('should read a notification', async () => {
    const notification = makeNotification()

    await notificationsRepository.create(notification)

    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString()
    })

    expect(result.isRight()).toBe(true)

    if (!result.isRight()) return

    expect(result.value.notification).toEqual(
      expect.objectContaining({
        readAt: expect.any(Date)
      })
    )
  })
})
