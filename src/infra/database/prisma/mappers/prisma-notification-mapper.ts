import { Prisma, Notification as PrismaNotification } from 'generated/prisma'
import { UniqueEntityId } from '@/domain/forum/enterprise/entities/value-objects/unique-entity-id'
import { Notification } from '@/domain/notification/enterprise/notification'

export class PrismaNotificationMapper {
  static toDomain(raw: PrismaNotification): Notification {
    return Notification.create({
      title: raw.title,
      content: raw.content,
      recipientId: new UniqueEntityId(raw.recipientId),
      createdAt: raw.createdAt,
      readAt: raw.readAt
    })
  }

  static toPrisma(
    notification: Notification
  ): Prisma.NotificationUncheckedCreateInput {
    return {
      id: notification.id.toString(),
      title: notification.title,
      content: notification.content,
      recipientId: notification.recipientId.toString(),
      createdAt: notification.createdAt,
      readAt: notification.readAt
    }
  }
}
