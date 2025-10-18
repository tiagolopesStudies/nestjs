import { randomUUID } from 'node:crypto'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import {
  Uploader,
  UploadParams
} from '@/domain/forum/application/storage/uploader'
import { EnvService } from '../env/env.service'

@Injectable()
export class R2Storage implements Uploader {
  private readonly client: S3Client

  constructor(private readonly envService: EnvService) {
    const accountId = envService.get('CLOUDFLARE_ACCOUNT_ID')

    this.client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId: envService.get('CLOUDFLARE_ACCESS_KEY_ID'),
        secretAccessKey: envService.get('CLOUDFLARE_SECRET_ACCESS_KEY')
      }
    })
  }

  async upload({
    fileName,
    fileType,
    body
  }: UploadParams): Promise<{ url: string }> {
    const uploadId = randomUUID()
    const uniqueFileName = `${uploadId}-${fileName}`

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.envService.get('CLOUDFLARE_BUCKET'),
        Key: uniqueFileName,
        ContentType: fileType,
        Body: body
      })
    )

    return {
      url: uniqueFileName
    }
  }
}
