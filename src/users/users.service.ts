import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) public repo: Repository<User>,
  ) {}

  private validateData(email: string, password: string, policy: string): string | null {
    const emailRegex = /^[a-zA-Z0-9._%+-]{7,}@[a-zA-Z0-9.-]{4,}\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) return 'Неверный формат email';

    const passwordRegex = /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,}$/;
    if (!passwordRegex.test(password)) return 'Пароль должен быть не менее 6 символов (без кириллицы)';

    const policyRegex = /^\d{12}$/;
    if (!policyRegex.test(policy)) return 'Полис ОМС должен состоять ровно из 12 цифр';

    return null;
  }

  async create(createUserDto: any): Promise<{ success: boolean; message?: string; data?: any }> {
    const { email, password, policy } = createUserDto;
    const error = this.validateData(email, password, policy);
    if (error) return { success: false, message: error };

    const existing = await this.repo.findOneBy({ email });
    if (existing) return { success: false, message: 'Пользователь с таким email уже существует' };

    const user = this.repo.create(createUserDto);
    return { success: true, data: await this.repo.save(user) };
  }

  async findAll() { return this.repo.find(); }

  async findOne(id: number) {
    const user = await this.repo.findOneBy({ id });
    return user || false;
  }

  async remove(id: number) {
    const result = await this.repo.delete(id);
    return result.affected ? { success: true, message: 'Удален' } : { success: false, message: 'Не найден' };
  }
}