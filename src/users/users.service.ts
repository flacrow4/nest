import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) public repo: Repository<User>,
  ) {}

  // Валидация входных данных
  private validateData(data: any): string | null {
    // 1. Проверка полиса (ровно 12 цифр)
    if (!data.policy) return 'Полис обязателен для заполнения';
    const policyRegex = /^\d{12}$/;
    if (!policyRegex.test(data.policy)) {
      return 'Полис ОМС должен состоять ровно из 12 цифр (без букв, пробелов и знаков)';
    }

    // 2. Проверка возраста (только целое число)
    if (data.age === undefined || data.age === null) return 'Возраст обязателен';
    if (!Number.isInteger(Number(data.age)) || Number(data.age) < 0 || Number(data.age) > 150) {
      return 'Возраст должен быть целым числом от 0 до 150 (без букв и знаков)';
    }

    // 3. Проверка имени и фамилии (не пустые строки)
    if (!data.firstname || typeof data.firstname !== 'string' || data.firstname.trim() === '') {
      return 'Имя обязательно для заполнения';
    }
    if (!data.lastname || typeof data.lastname !== 'string' || data.lastname.trim() === '') {
      return 'Фамилия обязательна для заполнения';
    }

    return null; // Ошибок нет
  }

  // C - Create
  async create(createUserDto: any): Promise<{ success: boolean; message?: string; data?: any }> {
    const error = this.validateData(createUserDto);
    if (error) {
      return { success: false, message: error };
    }

    // Принудительно приводим возраст к числу на всякий случай
    createUserDto.age = Number(createUserDto.age);

    const user = this.repo.create(createUserDto);
    const savedUser = await this.repo.save(user);
    return { success: true, data: savedUser };
  }

  // L - List
  async findAll(): Promise<User[]> {
    return this.repo.find();
  }

  // R - Read
  async findOne(id: number): Promise<User | false> {
    const user = await this.repo.findOneBy({ id });
    return user || false;
  }

  // U - Update
  async update(id: number, updateData: any): Promise<{ success: boolean; message?: string; data?: any }> {
    const user = await this.findOne(id);
    if (!user) {
      return { success: false, message: 'Пользователь с таким ID не найден' };
    }

    // Если передают полис или возраст при обновлении, их тоже нужно проверить
    const dataToValidate = { ...user, ...updateData }; // Объединяем старые и новые данные
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
  }

  // D - Delete
  async remove(id: number): Promise<{ success: boolean; message: string }> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      return { success: false, message: 'Пользователь с таким ID не найден' };
    }
    return { success: true, message: 'Пользователь удален' };
  }
}