import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: any) {
    // Вызываем метод сервиса, который уже обернут в try/catch
    const result = await this.usersService.create(createUserDto);
    if (!result.success) {
      return { success: false, error: result.message };
    }
    return { success: true, data: result.data };
  }

  @Get()
  async findAll() {
    // Метод findAll в сервисе теперь возвращает массив напрямую (или обернутый объект, проверьте ваш код)
    return { success: true, data: await this.usersService.findAll() };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(+id);
    if (!user) {
      return { success: false, error: 'Пользователь не найден' };
    }
    return { success: true, data: user };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: any) {
    const result = await this.usersService.update(+id, updateData);
    if (!result.success) {
      return { success: false, error: result.message };
    }
    return { success: true, data: result.data };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(+id);
  }
}