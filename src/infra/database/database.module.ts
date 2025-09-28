import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaAnswerRepository } from './prisma/repositories/prisma-answer-repository'
import { PrismaNotificationsRepository } from './prisma/repositories/prisma-notifications-repository'
import { PrismaQuestionAttachmentRepository } from './prisma/repositories/prisma-question-attachment-repository'
import { PrismaQuestionCommentRepository } from './prisma/repositories/prisma-question-comment-repository'
import { PrismaQuestionRepository } from './prisma/repositories/prisma-question-repository'

@Module({
  providers: [
    PrismaService,
    PrismaQuestionRepository,
    PrismaQuestionCommentRepository,
    PrismaQuestionAttachmentRepository,
    PrismaAnswerRepository,
    PrismaNotificationsRepository
  ],
  exports: [
    PrismaService,
    PrismaQuestionRepository,
    PrismaAnswerRepository,
    PrismaNotificationsRepository,
    PrismaQuestionCommentRepository,
    PrismaQuestionAttachmentRepository
  ]
})
export class DatabaseModule {}
