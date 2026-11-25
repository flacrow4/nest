import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Doctor } from '../doctor/doctor.entity';
import { User } from '../users/user.entity';

@Entity('appointment')
export class Appointment {
  @PrimaryGeneratedColumn() id: number;
  @Column() doctor_id: number;
  @Column() client_id: number;
  @Column({ type: 'timestamp' }) visit_at: Date;
  @Column({ default: 'booked' }) status: string; // Новое поле

  @ManyToOne(() => Doctor, (doctor) => doctor.appointments)
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;

  @ManyToOne(() => User, (user) => user.appointments)
  @JoinColumn({ name: 'client_id' })
  patient: User;
}