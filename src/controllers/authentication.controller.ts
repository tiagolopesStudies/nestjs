import { Controller, Post } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Controller('sessions')
export class AuthenticationController {
  constructor(private jwt: JwtService) {}

  @Post()
  async handle() {
    const token = await this.jwt.signAsync({ sub: 'test-id' })
    return { token }
  }
}
