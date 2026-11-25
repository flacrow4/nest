import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Schedule } from '../schedule/schedule.entity';
import { Appointment } from '../appointment/appointment.entity';

@Entity('doctor')
export class Doctor {
  @PrimaryGeneratedColumn() id: number;
  @Column() firstname: string;
  @Column() lastname: string;
  @Column() specialization: string;
  @Column() cabinet: string;

  @OneToMany(() => Schedule, (schedule) => schedule.doctor)
  schedules: Schedule[];

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments: Appointment[];
}