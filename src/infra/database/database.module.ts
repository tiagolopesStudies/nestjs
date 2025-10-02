import { Module } from '@nestjs/common'
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import { StudentRepository } from '@/domain/forum/application/repositories/student-repository'
import { PrismaService } from './prisma/prisma.service'
import { PrismaAnswerRepository } from './prisma/repositories/prisma-answer-repository'
import { PrismaNotificationsRepository } from './prisma/repositories/prisma-notifications-repository'
import { PrismaQuestionAttachmentRepository } from './prisma/repositories/prisma-question-attachment-repository'
import { PrismaQuestionCommentRepository } from './prisma/repositories/prisma-question-comment-repository'
import { PrismaQuestionRepository } from './prisma/repositories/prisma-question-repository'
import { PrismaStudentRepository } from './prisma/repositories/prisma-student-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: QuestionRepository,
      useClass: PrismaQuestionRepository
    },
    {
      provide: StudentRepository,
      useClass: PrismaStudentRepository
    },
    PrismaQuestionCommentRepository,
    PrismaQuestionAttachmentRepository,
    PrismaAnswerRepository,
    PrismaNotificationsRepository
  ],
  exports: [
    PrismaService,
    QuestionRepository,
    StudentRepository,
    PrismaAnswerRepository,
    PrismaNotificationsRepository,
    PrismaQuestionCommentRepository,
    PrismaQuestionAttachmentRepository
  ]
})
export class DatabaseModule {}
