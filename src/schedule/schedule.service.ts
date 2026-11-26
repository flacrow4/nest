import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from './schedule.entity';

@Injectable()
export class ScheduleService {
  constructor(@InjectRepository(Schedule) public repo: Repository<Schedule>) {}

  async create(data: any) {
    try {
      const schedule = this.repo.create(data);
      return { success: true, data: await this.repo.save(schedule) };
    } catch (error) {
      console.error('Ошибка при создании расписания:', error);
      throw new InternalServerErrorException('Не удалось создать расписание');
    }
  }

  async findAll() {
    try {
      // Подтягиваем данные врача через relations
      return { success: true, data: await this.repo.find({ relations: { doctor: true } }) };
    } catch (error) {
      console.error('Ошибка при получении расписания:', error);
      throw new InternalServerErrorException('Не удалось получить расписание');
    }
  }

  async findOne(id: number) {
    try {
      const schedule = await this.repo.findOne({
        where: { id },
        relations: { doctor: true }
      });
      if (!schedule) return { success: false, error: 'Расписание не найдено' };
      return { success: true, data: schedule };
    } catch (error) {
      console.error(`Ошибка при поиске расписания с ID ${id}:`, error);
      throw new InternalServerErrorException('Не удалось найти расписание');
    }
  }

  async update(id: number, updateData: any) {
    try {
      const schedule = await this.repo.findOneBy({ id });
      if (!schedule) return { success: false, error: 'Расписание не найдено' };

      Object.assign(schedule, updateData);
      return { success: true, data: await this.repo.save(schedule) };
    } catch (error) {
      console.error(`Ошибка при обновлении расписания с ID ${id}:`, error);
      throw new InternalServerErrorException('Не удалось обновить расписание');
    }
  }

  async remove(id: number) {
    try {
      const result = await this.repo.delete(id);
      if (result.affected === 0) return { success: false, error: 'Расписание не найдено' };
      return { success: true, data: { message: 'Расписание удалено' } };
    } catch (error) {
      console.error(`Ошибка при удалении расписания с ID ${id}:`, error);
      throw new InternalServerErrorException('Не удалось удалить расписание');
    }
  }
}