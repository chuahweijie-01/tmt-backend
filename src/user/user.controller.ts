import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserResponse } from './types/create-user-response';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateUserResponse> {
    const user = await this.userService.create(createUserDto);
    if (!user) throw new Error('Account creation failed.');
    return { username: user.username };
  }

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }
}
