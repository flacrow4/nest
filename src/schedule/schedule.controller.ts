import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
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

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.scheduleService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: any) {
    return await this.scheduleService.update(+id, updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.scheduleService.remove(+id);
  }
}