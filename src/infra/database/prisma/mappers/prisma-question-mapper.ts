import type { Prisma, Question as PrismaQuestion } from 'generated/prisma'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { UniqueEntityId } from '@/domain/forum/enterprise/entities/value-objects/unique-entity-id'

export class PrismaQuestionMapper {
  static toDomain(raw: PrismaQuestion): Question {
    return Question.create(
      {
        authorId: new UniqueEntityId(raw.authorId),
        content: raw.content,
        createdAt: raw.createdAt,
        slug: Slug.create(raw.slug),
        title: raw.title,
        updatedAt: raw.updatedAt,
        bestAnswerId: raw.bestAnswerId
          ? new UniqueEntityId(raw.bestAnswerId)
          : null
      },
      new UniqueEntityId(raw.id)
    )
  }

  static toPrisma(question: Question): Prisma.QuestionUncheckedCreateInput {
    return {
      id: question.id.toString(),
      authorId: question.authorId.toString(),
      content: question.content,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      slug: question.slug.value,
      title: question.title,
      bestAnswerId: question.bestAnswerId?.toString()
    }
  }
}
