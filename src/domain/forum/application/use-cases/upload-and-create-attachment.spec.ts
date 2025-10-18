import { InMemoryAttachmentRepository } from 'test/repositories/in-memory-attachment-repository'
import { FakeUploader } from 'test/storage/fake-uploader'
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type-error'
import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment'

let sut: UploadAndCreateAttachmentUseCase
let attachmentRepository: InMemoryAttachmentRepository
let uploader: FakeUploader

describe('Upload and create attachment', () => {
  beforeEach(() => {
    attachmentRepository = new InMemoryAttachmentRepository()
    uploader = new FakeUploader()
    sut = new UploadAndCreateAttachmentUseCase(attachmentRepository, uploader)
  })

  it('should be able to upload an attachment', async () => {
    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from('')
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual({
      attachment: attachmentRepository.items[0]
    })
  })

  it('should not be able to upload an attachment with invalid file type', async () => {
    const result = await sut.execute({
      fileName: 'profile.svg',
      fileType: 'image/svg',
      body: Buffer.from('')
    })

    expect(result.isRight()).toBeFalsy()
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError)
  })
})
