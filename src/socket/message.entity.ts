import { Users } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sender: number;

  @Column()
  receiver: number;

  @Column()
  content: string;

  @Column()
  createdAt: Date;
}