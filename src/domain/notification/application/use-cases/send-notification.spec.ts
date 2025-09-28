import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { NotificationsRepository } from '../repositories/notifications-repository'
import { SendNotificationUseCase } from './send-notification'

let notificationsRepository: NotificationsRepository
let sut: SendNotificationUseCase

describe('Send notification', () => {
  beforeEach(() => {
    notificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(notificationsRepository)
  })

  it('should send a notification', async () => {
    const notification = await sut.execute({
      recipientId: 'example-recipient-id',
      title: 'Example title',
      content: 'Example content'
    })

    expect(notification.isRight()).toBe(true)
    expect(notification.value?.notification).toEqual(
      expect.objectContaining({
        title: 'Example title',
        content: 'Example content'
      })
    )
  })
})
