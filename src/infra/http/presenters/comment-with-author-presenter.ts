import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

export class CommentWithAuthorPresenter {
  static toHTTP(comment: CommentWithAuthor) {
    return {
      id: comment.commentId.toString(),
      content: comment.content,
      authorId: comment.authorId.toString(),
      author: comment.author,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt
    }
  }
}
