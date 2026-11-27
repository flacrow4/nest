import { Injectable, BadRequestException, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from './schedule.entity';

@Injectable()
export class ScheduleService {
  constructor(@InjectRepository(Schedule) public repo: Repository<Schedule>) {}

  async create(data: any) {
    const { doctor_id, work_schedule } = data;
    if (isNaN(doctor_id) || doctor_id < 1) throw new BadRequestException('ID врача должен быть положительным числом');
    if (!work_schedule) throw new BadRequestException('Необходимо указать время');

    try {
      const existing = await this.repo.findOne({ where: { doctor_id, work_schedule: new Date(work_schedule) } });
      if (existing) throw new ConflictException('У этого врача уже есть график на это время');

      return { success: true, data: await this.repo.save(this.repo.create(data)) };
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Не удалось создать график');
    }
  }

  async findAll() {
    try {
      return { success: true, data: await this.repo.find({ relations: { doctor: true } }) };
    } catch (error) {
      throw new InternalServerErrorException('Не удалось получить графики');
    }
  }

  async remove(id: number) {
    if (isNaN(id) || id < 1) throw new BadRequestException('ID должен быть положительным числом');
    try {
      const result = await this.repo.delete(id);
      if (result.affected === 0) throw new NotFoundException('График не найден');
      return { success: true, data: { message: 'График удален' } };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Не удалось удалить график');
    }
  }
}