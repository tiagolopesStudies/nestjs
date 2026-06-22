import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { UserService } from '@/users/user.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly userService: UserService,
  ) {}

  async create(createMessageDto: CreateMessageDto) {
    const [userFrom, userTo] = await Promise.all([
      this.userService.getById(createMessageDto.fromId),
      this.userService.getById(createMessageDto.toId),
    ]);

    const message = this.messageRepository.create({
      text: createMessageDto.text,
      from: userFrom,
      to: userTo,
      read: createMessageDto.read ?? false,
    });

    await this.messageRepository.insert(message);

    return message;
  }

  findAll() {
    return this.messageRepository.find();
  }

  async findOne(id: number) {
    const message = await this.messageRepository.findOneBy({ id });

    if (!message) {
      throw new NotFoundException('Message not found!');
    }

    return message;
  }

  async update(id: number, updateMessageDto: UpdateMessageDto) {
    const [userFrom, userTo] = await Promise.all([
      updateMessageDto.fromId
        ? this.userService.getById(updateMessageDto.fromId)
        : undefined,
      updateMessageDto.toId
        ? this.userService.getById(updateMessageDto.toId)
        : undefined,
    ]);

    await this.messageRepository.update(id, {
      text: updateMessageDto.text,
      from: userFrom,
      to: userTo,
      read: updateMessageDto.read ?? false,
    });
  }

  async remove(id: number) {
    const message = await this.findOne(id);

    if (!message) {
      throw new NotFoundException('Message not found!');
    }

    await this.messageRepository.delete(id);
  }
}
