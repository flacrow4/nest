import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ScheduleService } from './schedule.service';

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  async create(@Body() createScheduleDto: any) {
    return await this.scheduleService.create(createScheduleDto);
  }

  @Get()
  async findAll() {
    return await this.scheduleService.findAll();
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    // Если вы добавите метод remove в сервис расписания, контроллер будет выглядеть так.
    // Если нет — можно оставить как есть или удалить этот метод.
    return { success: true, message: 'Удаление пока не реализовано в сервисе' };
  }
}