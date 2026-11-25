import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Appointment } from '../appointment/appointment.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn() id: number;
  @Column() firstname: string;
  @Column() lastname: string;
  @Column() age: number;
  @Column({ length: 12 }) policy: string; // Полис
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) created_at: Date;

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments: Appointment[];
}