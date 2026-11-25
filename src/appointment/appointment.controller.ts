import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { AppointmentService } from './appointment.service';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  async create(@Body() createAppointmentDto: any) { return await this.appointmentService.repo.save(createAppointmentDto); }

  @Get()
  async findAll() { return await this.appointmentService.repo.find({ relations: { doctor: true, patient: true } }); }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.appointmentService.repo.findOne({ where: { id: +id }, relations: { doctor: true, patient: true } });
  }

  @Patch(':id')
  async updateStatus(@Param('id') id: string, @Body() updateData: any) {
    await this.appointmentService.repo.update(+id, updateData);
    return await this.appointmentService.repo.findOneBy({ id: +id });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) { return await this.appointmentService.repo.delete(+id); }
}