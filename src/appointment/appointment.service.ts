import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';

@Injectable()
export class AppointmentService {
  constructor(@InjectRepository(Appointment) public repo: Repository<Appointment>) {}

  async create(data: any) {
    try {
      const appointment = this.repo.create(data);
      return { success: true, data: await this.repo.save(appointment) };
    } catch (error) {
      console.error('Ошибка при создании записи:', error);
      throw new InternalServerErrorException('Не удалось создать запись');
    }
  }

  async findAll() {
    try {
      return {
        success: true,
        data: await this.repo.find({ relations: { doctor: true, patient: true } })
      };
    } catch (error) {
      console.error('Ошибка при получении записей:', error);
      throw new InternalServerErrorException('Не удалось получить записи');
    }
  }

  async findOne(id: number) {
    try {
      const appointment = await this.repo.findOne({
        where: { id },
        relations: { doctor: true, patient: true }
      });
      if (!appointment) return { success: false, error: 'Запись не найдена' };
      return { success: true, data: appointment };
    } catch (error) {
      console.error(`Ошибка при поиске записи с ID ${id}:`, error);
      throw new InternalServerErrorException('Не удалось найти запись');
    }
  }

  async update(id: number, updateData: any) {
    try {
      const appointment = await this.repo.findOneBy({ id });
      if (!appointment) return { success: false, error: 'Запись не найдена' };

      Object.assign(appointment, updateData);
      return { success: true, data: await this.repo.save(appointment) };
    } catch (error) {
      console.error(`Ошибка при обновлении записи с ID ${id}:`, error);
      throw new InternalServerErrorException('Не удалось обновить запись');
    }
  }

  async remove(id: number) {
    try {
      const result = await this.repo.delete(id);
      if (result.affected === 0) return { success: false, error: 'Запись не найдена' };
      return { success: true, data: { message: 'Запись удалена' } };
    } catch (error) {
      console.error(`Ошибка при удалении записи с ID ${id}:`, error);
      throw new InternalServerErrorException('Не удалось удалить запись');
    }
  }
}