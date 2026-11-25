import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) public repo: Repository<User>,
  ) {}

  // Валидация: только полис из 12 цифр
  private validateData(policy: string): string | null {
    const policyRegex = /^\d{12}$/;
    if (!policyRegex.test(policy)) return 'Полис ОМС должен состоять ровно из 12 цифр';
    return null;
  }

  // C - Create
  async create(createUserDto: any): Promise<{ success: boolean; message?: string; data?: any }> {
    const { policy } = createUserDto;

    const error = this.validateData(policy);
    if (error) return { success: false, message: error };

    // Сохраняем в базу (id генерируется автоматически)
    const user = this.repo.create(createUserDto);
    return { success: true, data: await this.repo.save(user) };
  }

  // R - Read
  async findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const user = await this.repo.findOneBy({ id });
    return user || false;
  }

  // U - Update
  async update(id: number, updateData: any) {
    const user = await this.findOne(id);
    if (!user) return { success: false, message: 'Пользователь не найден' };

    Object.assign(user, updateData);
    return { success: true, data: await this.repo.save(user) };
  }

  // D - Delete
  async remove(id: number) {
    const result = await this.repo.delete(id);
    return result.affected ? { success: true, message: 'Удален' } : { success: false, message: 'Не найден' };
  }
}