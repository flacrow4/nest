import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ScheduleService } from './schedule.service';

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  // C - Create
  @Post()
  async create(@Body() createScheduleDto: any) {
    const schedule = await this.scheduleService.repo.save(createScheduleDto);
    return { success: true, data: schedule };
  }

  // L - List
  @Get()
  async findAll() {
    // Подтягиваем данные врача через relations
    return { success: true, data: await this.scheduleService.repo.find({ relations: { doctor: true } }) };
  }

  // R - Read
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const schedule = await this.scheduleService.repo.findOne({
      where: { id: +id },
      relations: { doctor: true }
    });
    if (!schedule) {
      return { success: false, error: 'Расписание не найдено' };
    }
    return { success: true, data: schedule };
  }

  // U - Update
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: any) {
    const schedule = await this.scheduleService.repo.findOneBy({ id: +id });
    if (!schedule) {
      return { success: false, error: 'Расписание не найдено' };
    }
    Object.assign(schedule, updateData);
    const updatedSchedule = await this.scheduleService.repo.save(schedule);
    return { success: true, data: updatedSchedule };
  }

  // D - Delete
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.scheduleService.repo.delete(+id);
    if (result.affected === 0) {
      return { success: false, error: 'Расписание не найдено' };
    }
    return { success: true, data: { message: 'Расписание удалено' } };
  }
}