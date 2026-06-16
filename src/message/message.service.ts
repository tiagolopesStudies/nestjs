import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async create(createMessageDto: CreateMessageDto) {
    const message = this.messageRepository.create({
      text: createMessageDto.text,
      from: createMessageDto.from,
      to: createMessageDto.to,
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
    await this.messageRepository.update(id, {
      text: updateMessageDto.text,
      from: updateMessageDto.from,
      to: updateMessageDto.to,
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
