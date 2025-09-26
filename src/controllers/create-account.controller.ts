import { Body, ConflictException, Controller, Post } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

interface CreateAccountBody {
  name: string
  email: string
  password: string
}

@Controller('/accounts')
export class CreateAccountController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  async handle(@Body() body: CreateAccountBody) {
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
        password
      }
    })

    return {
      message: 'Account created successfully.'
    }
  }
}
