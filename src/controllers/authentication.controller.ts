import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import bcryptjs from 'bcryptjs'
import { z } from 'zod'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { PrismaService } from '@/prisma/prisma.service'

const authenticationBodySchema = z.object({
  email: z.email(),
  password: z.string().min(6)
})

type AuthenticationBody = z.infer<typeof authenticationBodySchema>

@Controller('/sessions')
@UsePipes(new ZodValidationPipe(authenticationBodySchema))
export class AuthenticationController {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService
  ) {}

  @Post()
  async handle(@Body() body: AuthenticationBody) {
    const { email, password } = body
    const user = await this.prisma.user.findUnique({ where: { email } })

    if (!user || !bcryptjs.compareSync(password, user.password)) {
      throw new UnauthorizedException('User credentials do not match')
    }

    const accessToken = this.jwt.sign({ sub: user.id })
    return { access_token: accessToken }
  }
}
