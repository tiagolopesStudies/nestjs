import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(data: CreateUserDto) {
    const result = await this.userRepository.insert({
      ...data,
    });

    console.log(result);
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async update(id: string, data: UpdateUserDto) {
    await this.userRepository.update(id, {
      ...data,
    });
  }

  async delete(id: string) {
    await this.userRepository.delete(id);
  }
}
