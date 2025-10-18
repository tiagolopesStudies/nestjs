import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { UploadAndCreateAttachmentUseCase } from '@/domain/forum/application/use-cases/upload-and-create-attachment'

const fileValidationPipe = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }), // 2MB
    new FileTypeValidator({ fileType: /(jpg|jpeg|png|pdf)$/ }) // somente imagens e pdf
  ]
})

@Controller('/attachments')
export class UploadAttachmentController {
  constructor(
    private readonly uploadAndCreateAttachment: UploadAndCreateAttachmentUseCase
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async handle(@UploadedFile(fileValidationPipe) file: Express.Multer.File) {
    const result = await this.uploadAndCreateAttachment.execute({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer
    })

    if (result.isLeft()) {
      const error = result.value

      throw new BadRequestException(error.message)
    }

    const { attachment } = result.value

    return {
      attachment_id: attachment.id.toString()
    }
  }
}
