import { Injectable, BadRequestException, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Appointment } from './appointment.entity';
import { Doctor } from '../doctor/doctor.entity';
import { User } from '../users/user.entity';
import { Schedule } from '../schedule/schedule.entity';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment) public repo: Repository<Appointment>,
    @InjectRepository(Doctor) private doctorRepo: Repository<Doctor>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Schedule) private scheduleRepo: Repository<Schedule>,
  ) {}

  async create(data: any) {
    const { doctor_id, client_id, visit_at } = data;
    const visitDate = new Date(visit_at);

    if (isNaN(doctor_id) || doctor_id < 1) throw new BadRequestException('ID врача должен быть положительным числом');
    if (isNaN(client_id) || client_id < 1) throw new BadRequestException('ID пациента должен быть положительным числом');
    if (!visit_at) throw new BadRequestException('Необходимо указать время приема');

    const doctor = await this.doctorRepo.findOneBy({ id: doctor_id });
    if (!doctor) throw new NotFoundException('Врач не найден');

    const patient = await this.userRepo.findOneBy({ id: client_id });
    if (!patient) throw new NotFoundException('Пациент не найден');

    const schedule = await this.scheduleRepo.findOne({ where: { doctor_id, work_schedule: visitDate } });
    if (!schedule) throw new BadRequestException('Врач не работает в это время');

    const doctorBusy = await this.repo.findOne({ where: { doctor_id, visit_at: visitDate } });
    if (doctorBusy) throw new ConflictException('Врач уже занят в это время');

    const patientBusy = await this.repo.findOne({ where: { client_id, visit_at: visitDate } });
    if (patientBusy) throw new ConflictException('Пациент уже записан в это время');

    const doctorsInCabinet = await this.doctorRepo.findBy({ cabinet: doctor.cabinet });
    const doctorIdsInCabinet = doctorsInCabinet.map(d => d.id);

    if (doctorIdsInCabinet.length > 0) {
      const cabinetBusy = await this.repo.findOne({ where: { doctor_id: In(doctorIdsInCabinet), visit_at: visitDate } });
      if (cabinetBusy) throw new ConflictException('Кабинет занят другим врачом');
    }

    try {
      return { success: true, data: await this.repo.save(this.repo.create(data)) };
    } catch (error) {
      throw new InternalServerErrorException('Не удалось сохранить запись');
    }
  }

  async findAll() {
    try {
      return { success: true, data: await this.repo.find({ relations: { doctor: true, patient: true } }) };
    } catch (error) {
      throw new InternalServerErrorException('Не удалось получить записи');
    }
  }

  async findOne(id: number) {
    if (isNaN(id) || id < 1) throw new BadRequestException('ID должен быть положительным числом');
    try {
      const appointment = await this.repo.findOne({ where: { id }, relations: { doctor: true, patient: true } });
      if (!appointment) throw new NotFoundException('Запись не найдена');
      return { success: true, data: appointment };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Сбой сервера при поиске');
    }
  }

  async update(id: number, updateData: any) {
    if (isNaN(id) || id < 1) throw new BadRequestException('ID должен быть положительным числом');
    try {
      const appointment = await this.repo.findOneBy({ id });
      if (!appointment) throw new NotFoundException('Запись не найдена');
      Object.assign(appointment, updateData);
      return { success: true, data: await this.repo.save(appointment) };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Не удалось обновить запись');
    }
  }

  async remove(id: number) {
    if (isNaN(id) || id < 1) throw new BadRequestException('ID должен быть положительным числом');
    try {
      const result = await this.repo.delete(id);
      if (result.affected === 0) throw new NotFoundException('Запись не найдена');
      return { success: true, data: { message: 'Запись удалена' } };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Не удалось удалить запись');
    }
  }
}