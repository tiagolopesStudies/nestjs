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

  findAll() {
    return this.userRepository.find();
  }

  findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async getById(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException();
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
