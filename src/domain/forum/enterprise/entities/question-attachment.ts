import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from './value-objects/unique-entity-id'

export interface QuestionAttachmentProps {
  questionId: UniqueEntityId
  attachmentId: UniqueEntityId
}

export class QuestionAttachment extends Entity<QuestionAttachmentProps> {
  get questionId() {
    return this.props.questionId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  static create(props: QuestionAttachmentProps, id?: UniqueEntityId) {
    return new QuestionAttachment(props, id)
  }
}
