import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { InMemoryAttachmentRepository } from './in-memory-attachment-repository'
import { InMemoryQuestionAttachmentRepository } from './in-memory-question-attachment-repository'
import { InMemoryStudentRepository } from './in-memory-student-repository'

export class InMemoryQuestionRepository implements QuestionRepository {
  constructor(
    private questionAttachmentRepository: InMemoryQuestionAttachmentRepository,
    private attachmentRepository: InMemoryAttachmentRepository,
    private studentRepository: InMemoryStudentRepository
  ) {}

  public items: Question[] = []

  async create(question: Question): Promise<void> {
    this.items.push(question)

    await this.questionAttachmentRepository.createMany(
      question.attachments.getItems()
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async save(question: Question): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === question.id.toString()
    )

    if (itemIndex === -1) {
      return
    }

    this.items[itemIndex] = question

    await this.questionAttachmentRepository.createMany(
      question.attachments.getNewItems()
    )

    await this.questionAttachmentRepository.deleteMany(
      question.attachments.getRemovedItems()
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = this.items.find((item) => item.slug?.value === slug)

    return question ?? null
  }

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const question = this.items.find((item) => item.slug?.value === slug)

    if (!question) return null

    const author = this.studentRepository.students.find((student) =>
      student.id.equals(question.authorId)
    )

    if (!author) {
      throw new Error(
        `Author with id ${question.authorId.toString()} not found`
      )
    }

    const questionAttachments = this.questionAttachmentRepository.items.filter(
      ({ questionId }) => questionId.equals(question.id)
    )

    const attachments = questionAttachments.map((questionAttachment) => {
      const attachment = this.attachmentRepository.items.find(({ id }) =>
        id.equals(questionAttachment.attachmentId)
      )

      if (!attachment) {
        throw new Error(
          `Attachment with id ${questionAttachment.attachmentId.toString()} not found`
        )
      }

      return attachment
    })

    return QuestionDetails.create({
      questionId: question.id,
      title: question.title,
      content: question.content,
      slug: question.slug,
      authorId: question.authorId,
      author: author.name,
      attachments,
      bestAnswerId: question.bestAnswerId,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt
    })
  }

  async findById(questionId: string): Promise<Question | null> {
    const question = this.items.find(
      (item) => item.id.toString() === questionId
    )

    return question ?? null
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    return this.items
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)
  }

  async delete(question: Question): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === question.id.toString()
    )

    this.items.splice(itemIndex, 1)

    this.questionAttachmentRepository.deleteManyByQuestionId(
      question.id.toString()
    )
  }
}
