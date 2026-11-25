import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: any) {
    const result = await this.usersService.create(createUserDto);
    if (!result.success) return { success: false, error: result.message };
    return { success: true, data: result.data };
  }

  @Get()
  async findAll() { return { success: true, data: await this.usersService.findAll() }; }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(+id);
    if (!user) return { success: false, error: 'Не найден' };
    return { success: true, data: user };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) { return await this.usersService.remove(+id); }
}