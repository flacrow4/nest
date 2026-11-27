import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) public repo: Repository<User>) {}

  private validateData(data: any): void {
    if (!data.firstname || typeof data.firstname !== 'string' || !/^[a-zA-Zа-яА-ЯёЁ]+$/.test(data.firstname)) {
      throw new BadRequestException('Имя должно содержать только буквы');
    }
    if (!data.lastname || typeof data.lastname !== 'string' || !/^[a-zA-Zа-яА-ЯёЁ]+$/.test(data.lastname)) {
      throw new BadRequestException('Фамилия должна содержать только буквы');
    }

    const ageStr = String(data.age);
    if (!/^\d+$/.test(ageStr)) {
      throw new BadRequestException('Возраст должен состоять только из цифр (без знаков и пробелов)');
    }
    const age = Number(data.age);
    if (age < 0 || age > 150) {
      throw new BadRequestException('Возраст должен быть в диапазоне от 0 до 150');
    }

    if (!data.policy || !/^\d{12}$/.test(data.policy)) {
      throw new BadRequestException('Полис ОМС должен состоять ровно из 12 цифр');
    }
  }

  async create(createUserDto: any) {
    this.validateData(createUserDto);
    try {
      createUserDto.age = Number(createUserDto.age);
      return { success: true, data: await this.repo.save(this.repo.create(createUserDto)) };
    } catch (error) {
      throw new InternalServerErrorException('Не удалось сохранить пользователя из-за сбоя сервера');
    }
  }

  async findAll() {
    try {
      return { success: true, data: await this.repo.find() };
    } catch (error) {
      throw new InternalServerErrorException('Не удалось получить список пользователей');
    }
  }

  async findOne(id: number) {
    if (isNaN(id) || id < 1) throw new BadRequestException('ID должен быть положительным числом');
    try {
      const user = await this.repo.findOneBy({ id });
      if (!user) throw new NotFoundException('Пользователь с таким ID не найден');
      return { success: true, data: user };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Сбой сервера при поиске пользователя');
    }
  }

  async update(id: number, updateData: any) {
    if (isNaN(id) || id < 1) throw new BadRequestException('ID должен быть положительным числом');
    try {
      const user = await this.repo.findOneBy({ id });
      if (!user) throw new NotFoundException('Пользователь не найден');

      const dataToValidate = { ...user, ...updateData };
      this.validateData(dataToValidate);

      if (updateData.age !== undefined) updateData.age = Number(updateData.age);
      Object.assign(user, updateData);
      return { success: true, data: await this.repo.save(user) };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Не удалось обновить пользователя из-за сбоя сервера');
    }
  }

  async remove(id: number) {
    if (isNaN(id) || id < 1) throw new BadRequestException('ID должен быть положительным числом');
    try {
      const result = await this.repo.delete(id);
      if (result.affected === 0) throw new NotFoundException('Пользователь не найден');
      return { success: true, data: { message: 'Пользователь удален' } };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Не удалось удалить пользователя из-за сбоя сервера');
    }
  }
}