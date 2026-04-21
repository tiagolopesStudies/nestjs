import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() body: CreateUserDto) {
    await this.userService.create(body);

    return {
      message: 'created!',
    };
  }

  @Get()
  async findAll() {
    const users = await this.userService.findAll();

    return {
      users,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);

    return {
      user,
    };
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    await this.userService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.userService.delete(id);
  }
}
