import { faker } from '@faker-js/faker'
import { UniqueEntityId } from '@/domain/forum/enterprise/entities/value-objects/unique-entity-id'
import { Notification } from '@/domain/notification/enterprise/notification'

export function makeNotification(
  override: Partial<Notification> = {},
  id?: UniqueEntityId
) {
  return Notification.create(
    {
      recipientId: new UniqueEntityId(),
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      ...override
    },
    id
  )
}
