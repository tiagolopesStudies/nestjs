import {
  Body,
  ConflictException,
  Controller,
  Post,
  UsePipes
} from '@nestjs/common'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/prisma/prisma.service'

const createAccountBodySchema = z.object({
  email: z.email(),
  name: z.string().min(3),
  password: z.string().min(6)
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
export class CreateAccountController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { email, name, password } = body

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email
      }
    })

    if (userWithSameEmail) {
      throw new ConflictException('User with same email already exists.')
    }

    await this.prisma.user.create({
      data: {
        email,
        name,
        password: await hash(password, 8)
      }
    })

    return {
      message: 'Account created successfully.'
    }
  }
}
