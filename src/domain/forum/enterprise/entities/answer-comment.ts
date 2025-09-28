import { Optional } from '@/core/types/optional'
import { Comment, CommentProps } from './comment'
import { UniqueEntityId } from './value-objects/unique-entity-id'

export interface AnswerCommentProps extends CommentProps {
  answerId: UniqueEntityId
}

export class AnswerComment extends Comment<AnswerCommentProps> {
  get answerId() {
    return this.props.answerId
  }

  static create(
    props: Optional<AnswerCommentProps, 'createdAt'>,
    id?: UniqueEntityId
  ) {
    return new AnswerComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date()
      },
      id
    )
  }
}
