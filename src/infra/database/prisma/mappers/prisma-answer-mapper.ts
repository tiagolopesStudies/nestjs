import { Prisma, Answer as PrismaAnswer } from 'generated/prisma'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { UniqueEntityId } from '@/domain/forum/enterprise/entities/value-objects/unique-entity-id'

export class PrismaAnswerMapper {
  static toDomain(raw: PrismaAnswer): Answer {
    return Answer.create(
      {
        authorId: new UniqueEntityId(raw.authorId),
        content: raw.content,
        createdAt: raw.createdAt,
        questionId: new UniqueEntityId(raw.questionId),
        updatedAt: raw.updatedAt
      },
      new UniqueEntityId(raw.id)
    )
  }

  static toPrisma(answer: Answer): Prisma.AnswerUncheckedCreateInput {
    return {
      id: answer.id.toValue(),
      authorId: answer.authorId.toValue(),
      questionId: answer.questionId.toValue(),
      content: answer.content,
      createdAt: answer.createdAt
    }
  }
}
