import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // C - Create
  @Post()
  async create(@Body() createUserDto: any) {
    const result = await this.usersService.create(createUserDto);
    if (!result.success) {
      return { success: false, error: result.message };
    }
    return { success: true, data: result.data };
  }

  // L - List
  @Get()
  async findAll() {
    return { success: true, data: await this.usersService.findAll() };
  }

  // R - Read
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(+id);
    if (!user) {
      return { success: false, error: 'Пользователь не найден' };
    }
    return { success: true, data: user };
  }

  // U - Update
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: any) {
    const result = await this.usersService.update(+id, updateData);
    if (!result.success) {
      return { success: false, error: result.message };
    }
    return { success: true, data: result.data };
  }

  // D - Delete
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(+id);
  }
}