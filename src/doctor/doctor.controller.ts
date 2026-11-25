import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { DoctorService } from './doctor.service';

@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post()
  async create(@Body() createDoctorDto: any) { return await this.doctorService.repo.save(createDoctorDto); }

  @Get()
  async findAll() { return await this.doctorService.repo.find(); }

  @Get(':id')
  async findOne(@Param('id') id: string) { return await this.doctorService.repo.findOneBy({ id: +id }); }

  @Delete(':id')
  async remove(@Param('id') id: string) { return await this.doctorService.repo.delete(+id); }
}