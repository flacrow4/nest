import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) public repo: Repository<User>,
  ) {}

  private validateData(data: any): string | null {
    if (!data.policy) return 'Полис обязателен для заполнения';
    const policyRegex = /^\d{12}$/;
    if (!policyRegex.test(data.policy)) {
      return 'Полис ОМС должен состоять ровно из 12 цифр (без букв, пробелов и знаков)';
    }

    if (data.age === undefined || data.age === null) return 'Возраст обязателен';
    if (!Number.isInteger(Number(data.age)) || Number(data.age) < 0 || Number(data.age) > 150) {
      return 'Возраст должен быть целым числом от 0 до 150 (без букв и знаков)';
    }

    if (!data.firstname || typeof data.firstname !== 'string' || data.firstname.trim() === '') {
      return 'Имя обязательно для заполнения';
    }
    if (!data.lastname || typeof data.lastname !== 'string' || data.lastname.trim() === '') {
      return 'Фамилия обязательна для заполнения';
    }

    return null;
  }

  async create(createUserDto: any): Promise<{ success: boolean; message?: string; data?: any }> {
    try {
      const error = this.validateData(createUserDto);
      if (error) {
        return { success: false, message: error };
      }

      createUserDto.age = Number(createUserDto.age);
      const user = this.repo.create(createUserDto);
      const savedUser = await this.repo.save(user);
      return { success: true, data: savedUser };
    } catch (error) {
      console.error('Ошибка при создании пользователя:', error);
      throw new InternalServerErrorException('Не удалось создать пользователя');
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.repo.find();
    } catch (error) {
      console.error('Ошибка при получении списка пользователей:', error);
      throw new InternalServerErrorException('Не удалось получить список пользователей');
    }
  }

  async findOne(id: number): Promise<User | false> {
    try {
      const user = await this.repo.findOneBy({ id });
      return user || false;
    } catch (error) {
      console.error(`Ошибка при поиске пользователя с ID ${id}:`, error);
      throw new InternalServerErrorException('Не удалось найти пользователя');
    }
  }

  async update(id: number, updateData: any): Promise<{ success: boolean; message?: string; data?: any }> {
    try {
      const user = await this.findOne(id);
      if (!user) {
        return { success: false, message: 'Пользователь с таким ID не найден' };
      }

      const dataToValidate = { ...user, ...updateData };
      const error = this.validateData(dataToValidate);
      if (error) {
        return { success: false, message: error };
      }

      if (updateData.age !== undefined) {
        updateData.age = Number(updateData.age);
      }

      Object.assign(user, updateData);
      const updatedUser = await this.repo.save(user);
      return { success: true, data: updatedUser };
    } catch (error) {
      console.error(`Ошибка при обновлении пользователя с ID ${id}:`, error);
      throw new InternalServerErrorException('Не удалось обновить пользователя');
    }
  }

  async remove(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const result = await this.repo.delete(id);
      if (result.affected === 0) {
        return { success: false, message: 'Пользователь с таким ID не найден' };
      }
      return { success: true, message: 'Пользователь удален' };
    } catch (error) {
      console.error(`Ошибка при удалении пользователя с ID ${id}:`, error);
      throw new InternalServerErrorException('Не удалось удалить пользователя');
    }
  }
}