import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Doctor } from '../doctor/doctor.entity';

@Entity('schedule')
export class Schedule {
  @PrimaryGeneratedColumn() id: number;
  @Column() doctor_id: number;
  @Column({ type: 'timestamp' }) work_schedule: Date;

  @ManyToOne(() => Doctor, (doctor) => doctor.schedules)
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;
}