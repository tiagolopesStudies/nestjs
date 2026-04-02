import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export type CreateOrUpdateUserBody = Omit<User, 'id'>;

@Injectable()
export class UserService {
  private users: User[];

  constructor() {
    this.users = [];
  }

  create(user: CreateOrUpdateUserBody) {
    this.users.push({
      id: randomUUID(),
      ...user,
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

  update(id: string, user: CreateOrUpdateUserBody) {
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
