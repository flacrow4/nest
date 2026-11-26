import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { DoctorService } from './doctor.service';

@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post()
  async create(@Body() createDoctorDto: any) {
    return await this.doctorService.create(createDoctorDto);
  }

  @Get()
  async findAll() {
    return await this.doctorService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.doctorService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: any) {
    return await this.doctorService.update(+id, updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.doctorService.remove(+id);
  }
}