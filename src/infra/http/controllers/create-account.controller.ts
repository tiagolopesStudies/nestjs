import { Body, Controller, Post, UsePipes } from '@nestjs/common'
import { z } from 'zod'
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

const createAccountBodySchema = z.object({
  email: z.email(),
  name: z.string().min(3),
  password: z.string().min(6)
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
export class CreateAccountController {
  constructor(private readonly registerStudent: RegisterStudentUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { email, name, password } = body

    await this.registerStudent.execute({
      email,
      name,
      password
    })

    return {
      message: 'Account created successfully.'
    }
  }
}
