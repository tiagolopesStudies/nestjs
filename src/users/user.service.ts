import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

@Injectable()
export class UserService {
  private users: User[];

  constructor() {
    this.users = [];
  }

  create(data: CreateUserDto) {
    this.users.push({
      id: randomUUID(),
      ...data,
    });
  }

  findAll() {
    return this.users;
  }

  findOne(id: string) {
    const user = this.users.find((user) => user.id === id);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  update(id: string, user: UpdateUserDto) {
    const userIndex = this.users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      throw new NotFoundException();
    }

    this.users.splice(userIndex, 1, {
      id,
      ...user,
    });
  }

  delete(id: string) {
    const userIndex = this.users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      throw new NotFoundException();
    }

    this.users.splice(userIndex, 1);
  }
}
