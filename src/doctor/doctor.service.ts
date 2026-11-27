import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './doctor.entity';

@Injectable()
export class DoctorService {
  constructor(@InjectRepository(Doctor) public repo: Repository<Doctor>) {}

  private validateData(data: any): void {
    if (!data.firstname || typeof data.firstname !== 'string' || !/^[a-zA-Zа-яА-ЯёЁ]+$/.test(data.firstname)) {
      throw new BadRequestException('Имя врача должно содержать только буквы');
    }
    if (!data.lastname || typeof data.lastname !== 'string' || !/^[a-zA-Zа-яА-ЯёЁ]+$/.test(data.lastname)) {
      throw new BadRequestException('Фамилия врача должна содержать только буквы');
    }
    if (!data.specialization || typeof data.specialization !== 'string') {
      throw new BadRequestException('Специализация обязательна');
    }

    const cabinetStr = String(data.cabinet);
    if (!/^\d+$/.test(cabinetStr)) {
      throw new BadRequestException('Номер кабинета должен состоять только из цифр');
    }
    const cabinet = Number(data.cabinet);
    if (cabinet < 0) {
      throw new BadRequestException('Номер кабинета не может быть отрицательным');
    }
  }

  async create(data: any) {
    this.validateData(data);
    try {
      return { success: true, data: await this.repo.save(this.repo.create(data)) };
    } catch (error) {
      throw new InternalServerErrorException('Не удалось создать врача');
    }
  }

  async findAll() {
    try {
      return { success: true, data: await this.repo.find() };
    } catch (error) {
      throw new InternalServerErrorException('Не удалось получить врачей');
    }
  }

  async findOne(id: number) {
    if (isNaN(id) || id < 1) throw new BadRequestException('ID должен быть положительным числом');
    try {
      const doctor = await this.repo.findOneBy({ id });
      if (!doctor) throw new NotFoundException('Врач не найден');
      return { success: true, data: doctor };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Сбой сервера');
    }
  }

  async update(id: number, updateData: any) {
    if (isNaN(id) || id < 1) throw new BadRequestException('ID должен быть положительным числом');
    try {
      const doctor = await this.repo.findOneBy({ id });
      if (!doctor) throw new NotFoundException('Врач не найден');

      const dataToValidate = { ...doctor, ...updateData };
      this.validateData(dataToValidate);

      Object.assign(doctor, updateData);
      return { success: true, data: await this.repo.save(doctor) };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Не удалось обновить врача');
    }
  }

  async remove(id: number) {
    if (isNaN(id) || id < 1) throw new BadRequestException('ID должен быть положительным числом');
    try {
      const result = await this.repo.delete(id);
      if (result.affected === 0) throw new NotFoundException('Врач не найден');
      return { success: true, data: { message: 'Врач удален' } };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Не удалось удалить врача');
    }
  }
}