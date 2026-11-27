import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { Appointment } from './appointment.entity';
import { Doctor } from '../doctor/doctor.entity';
import { User } from '../users/user.entity';
import { Schedule } from '../schedule/schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, Doctor, User, Schedule])], // Все 4 сущности!
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule {}