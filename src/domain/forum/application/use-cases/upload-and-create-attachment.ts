import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { Attachment } from '../../enterprise/entities/attachment'
import { AttachmentRepository } from '../repositories/attachment-repository'
import { Uploader } from '../storage/uploader'
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type-error'

interface UploadAndCreateAttachmentRequest {
  fileName: string
  fileType: string
  body: Buffer
}

type UploadAndCreateAttachmentResponse = Promise<
  Either<InvalidAttachmentTypeError, { attachment: Attachment }>
>

@Injectable()
export class UploadAndCreateAttachmentUseCase {
  constructor(
    private readonly attachmentRepository: AttachmentRepository,
    private readonly uploader: Uploader
  ) {}

  async execute({
    fileName,
    fileType,
    body
  }: UploadAndCreateAttachmentRequest): UploadAndCreateAttachmentResponse {
    const fileTypeRegex = /^(image\/(jpeg|jpg|png))$|^application\/pdf$/
    if (!fileTypeRegex.test(fileType)) {
      return left(new InvalidAttachmentTypeError(fileType))
    }

    const { url } = await this.uploader.upload({ fileName, fileType, body })

    const attachment = Attachment.create({
      title: fileName,
      url
    })

    await this.attachmentRepository.create(attachment)

    return right({ attachment })
  }
}
