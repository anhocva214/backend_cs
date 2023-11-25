import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("csedeli.users")
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  email: string;

  @Column()
  phoneNumber: string;

  @Column()
  password: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column()
  isActive: boolean;

  @Column()
  roleId: number;
}
