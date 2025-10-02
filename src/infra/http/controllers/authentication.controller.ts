import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes
} from '@nestjs/common'
import { z } from 'zod'
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student'
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

  @Post()
  async handle(@Body() body: AuthenticationBody) {
    const { email, password } = body
    const result = await this.authenticateStudent.execute({
      email,
      password
    })

    if (result.isLeft()) {
      throw new UnauthorizedException(result.value.message)
    }

    const { accessToken } = result.value

    return { access_token: accessToken }
  }
}
