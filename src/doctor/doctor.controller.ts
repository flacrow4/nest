import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { DoctorService } from './doctor.service';

@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  // C - Create
  @Post()
  async create(@Body() createDoctorDto: any) {
    const doctor = await this.doctorService.repo.save(createDoctorDto);
    return { success: true, data: doctor };
  }

  // L - List
  @Get()
  async findAll() {
    return { success: true, data: await this.doctorService.repo.find() };
  }

  // R - Read
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const doctor = await this.doctorService.repo.findOneBy({ id: +id });
    if (!doctor) {
      return { success: false, error: 'Врач не найден' };
    }
    return { success: true, data: doctor };
  }

  // U - Update
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: any) {
    const doctor = await this.doctorService.repo.findOneBy({ id: +id });
    if (!doctor) {
      return { success: false, error: 'Врач не найден' };
    }
    Object.assign(doctor, updateData);
    const updatedDoctor = await this.doctorService.repo.save(doctor);
    return { success: true, data: updatedDoctor };
  }

  // D - Delete
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.doctorService.repo.delete(+id);
    if (result.affected === 0) {
      return { success: false, error: 'Врач не найден' };
    }
    return { success: true, data: { message: 'Врач удален' } };
  }
}