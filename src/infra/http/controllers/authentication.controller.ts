import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes
} from '@nestjs/common'
import { z } from 'zod'
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student'
import { Public } from '@/infra/auth/public'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

const authenticationBodySchema = z.object({
  email: z.email(),
  password: z.string().min(6)
})

type AuthenticationBody = z.infer<typeof authenticationBodySchema>

@Controller('/sessions')
@UsePipes(new ZodValidationPipe(authenticationBodySchema))
export class AuthenticationController {
  constructor(
    private readonly authenticateStudent: AuthenticateStudentUseCase
  ) {}

  @Public()
  @Post()
  async handle(@Body() body: AuthenticationBody) {
    const { email, password } = body
    const result = await this.authenticateStudent.execute({
      email,
      password
    })

    if (result.isLeft()) {
      const error = result.value

      throw new UnauthorizedException(error.message)
    }

    const { accessToken } = result.value

    return { access_token: accessToken }
  }
}
