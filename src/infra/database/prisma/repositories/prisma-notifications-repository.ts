import { Injectable } from '@nestjs/common'
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { Notification } from '@/domain/notification/enterprise/notification'

@Injectable()
export class PrismaNotificationsRepository implements NotificationsRepository {
  create(notification: Notification): Promise<void> {
    throw new Error('Method not implemented.')
  }
  findById(notificationId: string): Promise<Notification | null> {
    throw new Error('Method not implemented.')
  }
  save(notification: Notification): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
