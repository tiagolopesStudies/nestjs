import { Module } from '@nestjs/common'
import { AnswerRepository } from '@/domain/forum/application/repositories/answer-repository'
import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachment-repository'
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import { StudentRepository } from '@/domain/forum/application/repositories/student-repository'
import { PrismaService } from './prisma/prisma.service'
import { PrismaAnswerRepository } from './prisma/repositories/prisma-answer-repository'
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
    {
      provide: QuestionAttachmentRepository,
      useClass: PrismaQuestionAttachmentRepository
    },
    {
      provide: AnswerRepository,
      useClass: PrismaAnswerRepository
    },
    PrismaQuestionCommentRepository,
    PrismaQuestionAttachmentRepository
  ],
  exports: [
    PrismaService,
    QuestionRepository,
    StudentRepository,
    QuestionAttachmentRepository,
    AnswerRepository,
    PrismaQuestionCommentRepository,
    PrismaQuestionAttachmentRepository
  ]
})
export class DatabaseModule {}
