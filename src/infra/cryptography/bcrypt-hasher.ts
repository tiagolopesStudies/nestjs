import { Injectable } from '@nestjs/common'
import bcryptjs from 'bcryptjs'
import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'

@Injectable()
export class BcryptHasher implements HashGenerator, HashComparer {
  private HASH_SALT_LENGTH = 8

  hash(plain: string): Promise<string> {
    return bcryptjs.hash(plain, this.HASH_SALT_LENGTH)
  }

  compare(plain: string, hashed: string): Promise<boolean> {
    return bcryptjs.compare(plain, hashed)
  }
}
