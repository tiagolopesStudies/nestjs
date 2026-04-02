import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { type CreateOrUpdateUserBody, UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() body: CreateOrUpdateUserBody) {
    this.userService.create(body);

    return {
      message: 'created!',
    };
  }

  @Get()
  findAll() {
    const users = this.userService.findAll();

    return {
      users,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const user = this.userService.findOne(id);

    return {
      user,
    };
  }

  @Put(':id')
  @HttpCode(204)
  update(@Param('id') id: string, @Body() body: CreateOrUpdateUserBody) {
    this.userService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string) {
    this.userService.delete(id);
  }
}
