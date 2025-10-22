import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { Answer, AnswerProps } from '@/domain/forum/enterprise/entities/answer'
import { UniqueEntityId } from '@/domain/forum/enterprise/entities/value-objects/unique-entity-id'
import { PrismaAnswerMapper } from '@/infra/database/prisma/mappers/prisma-answer-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeAnswer(
  override: Partial<Answer> = {},
  id?: UniqueEntityId
) {
  return Answer.create(
    {
      questionId: new UniqueEntityId(),
      authorId: new UniqueEntityId(),
      content: faker.lorem.text(),
      ...override
    },
    id
  )
}

@Injectable()
export class AnswerFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaAnswer(data: Partial<AnswerProps> = {}) {
    const answer = makeAnswer(data)

    await this.prisma.answer.create({
      data: PrismaAnswerMapper.toPrisma(answer)
    })

    return answer
  }
}
