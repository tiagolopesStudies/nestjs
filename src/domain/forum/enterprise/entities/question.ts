import dayjs from 'dayjs'
import { Optional } from '@/core/types/optional'
import { Slug } from './value-objects/slug'
import { UniqueEntityId } from './value-objects/unique-entity-id'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { QuestionAttachmentList } from './question-attachment-list'
import { QuestionBestAnswerChosenEvent } from '../events/question-best-answer-chosen-event'

export interface QuestionProps {
  authorId: UniqueEntityId
  bestAnswerId?: UniqueEntityId
  attachments: QuestionAttachmentList
  title: string
  content: string
  slug?: Slug
  createdAt: Date
  updatedAt?: Date
}

export class Question extends AggregateRoot<QuestionProps> {
  get isNew(): boolean {
    return dayjs().diff(this.props.createdAt, 'days') <= 3
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  set title(title: string) {
    this.props.title = title
    this.props.slug = Slug.createFromText(title)
    this.touch()
  }

  get title() {
    return this.props.title
  }

  get content() {
    return this.props.content
  }

  get except() {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  get slug() {
    return this.props.slug
  }

  get authorId() {
    return this.props.authorId
  }

  get bestAnswerId() {
    return this.props.bestAnswerId
  }

  get attachments() {
    return this.props.attachments
  }

  set attachments(attachments: QuestionAttachmentList) {
    this.props.attachments = attachments
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  set bestAnswerId(bestAnswerId: UniqueEntityId | undefined) {
    if (bestAnswerId && !bestAnswerId.equals(this.props.bestAnswerId)) {
      this.addDomainEvents(
        new QuestionBestAnswerChosenEvent(this, bestAnswerId)
      )
    }

    this.props.bestAnswerId = bestAnswerId
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<QuestionProps, 'createdAt' | 'attachments'>,
    id?: UniqueEntityId
  ) {
    return new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        attachments: props.attachments ?? new QuestionAttachmentList(),
        createdAt: props.createdAt ?? new Date()
      },
      id
    )
  }
}
