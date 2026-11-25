import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ScheduleService } from './schedule.service';

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  async create(@Body() createScheduleDto: any) { return await this.scheduleService.repo.save(createScheduleDto); }

  @Get()
  async findAll() { return await this.scheduleService.repo.find({ relations: { doctor: true } }); }

  @Delete(':id')
  async remove(@Param('id') id: string) { return await this.scheduleService.repo.delete(+id); }
}