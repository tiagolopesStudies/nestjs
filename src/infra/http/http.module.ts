import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AuthenticationController } from './controllers/authentication.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateQuestionController } from './controllers/create-question.controller'
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller'

@Module({
  controllers: [
    CreateAccountController,
    AuthenticationController,
    CreateQuestionController,
    FetchRecentQuestionsController
  ],
  providers: [PrismaService]
})
export class HttpModule {}
