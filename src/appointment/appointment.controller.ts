import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { AppointmentService } from './appointment.service';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  // C - Create
  @Post()
  async create(@Body() createAppointmentDto: any) {
    const appointment = await this.appointmentService.repo.save(createAppointmentDto);
    return { success: true, data: appointment };
  }

  // L - List
  @Get()
  async findAll() {
    return {
      success: true,
      data: await this.appointmentService.repo.find({ relations: { doctor: true, patient: true } })
    };
  }

  // R - Read
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const appointment = await this.appointmentService.repo.findOne({
      where: { id: +id },
      relations: { doctor: true, patient: true }
    });
    if (!appointment) {
      return { success: false, error: 'Запись не найдена' };
    }
    return { success: true, data: appointment };
  }

  // U - Update
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: any) {
    const appointment = await this.appointmentService.repo.findOneBy({ id: +id });
    if (!appointment) {
      return { success: false, error: 'Запись не найдена' };
    }
    Object.assign(appointment, updateData);
    const updatedAppointment = await this.appointmentService.repo.save(appointment);
    return { success: true, data: updatedAppointment };
  }

  // D - Delete
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.appointmentService.repo.delete(+id);
    if (result.affected === 0) {
      return { success: false, error: 'Запись не найдена' };
    }
    return { success: true, data: { message: 'Запись удалена' } };
  }
}