import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import {
  Question,
  QuestionProps
} from '@/domain/forum/enterprise/entities/question'
import { UniqueEntityId } from '@/domain/forum/enterprise/entities/value-objects/unique-entity-id'
import { PrismaQuestionMapper } from '@/infra/database/prisma/mappers/prisma-question-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeQuestion(
  override: Partial<Question> = {},
  id?: UniqueEntityId
) {
  return Question.create(
    {
      authorId: new UniqueEntityId(),
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      ...override
    },
    id
  )
}

@Injectable()
export class QuestionFactory {
  constructor(private readonly prismaService: PrismaService) {}

  async makePrismaQuestion(data: Partial<QuestionProps> = {}) {
    const question = makeQuestion(data)

    await this.prismaService.question.create({
      data: PrismaQuestionMapper.toPrisma(question)
    })
  }
}
