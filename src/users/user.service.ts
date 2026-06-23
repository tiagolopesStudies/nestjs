import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from '@/common/dto/pagination.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(data: CreateUserDto) {
    const userWithSameEmail = await this.findByEmail(data.email);

    if (userWithSameEmail !== null) {
      throw new ConflictException('E-mail already registered!');
    }

    const user = this.userRepository.create({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    await this.userRepository.insert(user);

    return user;
  }

  findAll({ limit, offset }: PaginationDto) {
    return this.userRepository.find({
      order: { id: 'DESC' },
      skip: offset,
      take: limit,
    });
  }

  findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async getById(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id '${id}' not found.`);
    }

    return user;
  }

  async update(id: number, data: UpdateUserDto) {
    const userWithSameEmail = await this.findByEmail(data.email);

    if (userWithSameEmail !== null && userWithSameEmail.id !== id) {
      throw new ConflictException('E-mail already registered!');
    }

    await this.userRepository.update(id, {
      name: data.name,
      email: data.email,
      password: data.password,
    });
  }

  async delete(id: number) {
    await this.getById(id);

    await this.userRepository.delete(id);
  }
}
