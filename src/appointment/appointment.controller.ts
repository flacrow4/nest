import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { AppointmentService } from './appointment.service';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  async create(@Body() createAppointmentDto: any) {
    return await this.appointmentService.create(createAppointmentDto);
  }

  @Get()
  async findAll() {
    return await this.appointmentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.appointmentService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: any) {
    return await this.appointmentService.update(+id, updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.appointmentService.remove(+id);
  }
}