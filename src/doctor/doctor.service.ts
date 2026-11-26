import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './doctor.entity';

@Injectable()
export class DoctorService {
  constructor(@InjectRepository(Doctor) public repo: Repository<Doctor>) {}

  async create(data: any) {
    try {
      const doctor = this.repo.create(data);
      return { success: true, data: await this.repo.save(doctor) };
    } catch (error) {
      console.error('Ошибка при создании врача:', error);
      throw new InternalServerErrorException('Не удалось создать врача');
    }
  }

  async findAll() {
    try {
      return { success: true, data: await this.repo.find() };
    } catch (error) {
      console.error('Ошибка при получении списка врачей:', error);
      throw new InternalServerErrorException('Не удалось получить список врачей');
    }
  }

  async findOne(id: number) {
    try {
      const doctor = await this.repo.findOneBy({ id });
      if (!doctor) return { success: false, error: 'Врач не найден' };
      return { success: true, data: doctor };
    } catch (error) {
      console.error(`Ошибка при поиске врача с ID ${id}:`, error);
      throw new InternalServerErrorException('Не удалось найти врача');
    }
  }

  async update(id: number, updateData: any) {
    try {
      const doctor = await this.repo.findOneBy({ id });
      if (!doctor) return { success: false, error: 'Врач не найден' };

      Object.assign(doctor, updateData);
      return { success: true, data: await this.repo.save(doctor) };
    } catch (error) {
      console.error(`Ошибка при обновлении врача с ID ${id}:`, error);
      throw new InternalServerErrorException('Не удалось обновить врача');
    }
  }

  async remove(id: number) {
    try {
      const result = await this.repo.delete(id);
      if (result.affected === 0) return { success: false, error: 'Врач не найден' };
      return { success: true, data: { message: 'Врач удален' } };
    } catch (error) {
      console.error(`Ошибка при удалении врача с ID ${id}:`, error);
      throw new InternalServerErrorException('Не удалось удалить врача');
    }
  }
}