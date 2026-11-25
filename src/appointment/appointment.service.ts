import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';

@Injectable()
export class AppointmentService {
  constructor(@InjectRepository(Appointment) public repo: Repository<Appointment>) {}
}