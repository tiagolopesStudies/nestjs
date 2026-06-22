import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { UserModule } from '@/users/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), UserModule],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
