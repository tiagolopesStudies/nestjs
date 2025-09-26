import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { JwtStrategy } from './auth/jwt.strategy'
import { AuthenticationController } from './controllers/authentication.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { envSchema } from './env'
import { PrismaService } from './prisma/prisma.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => envSchema.parse(config)
    }),
    AuthModule
  ],
  controllers: [CreateAccountController, AuthenticationController],
  providers: [PrismaService, JwtStrategy]
})
export class AppModule {}
