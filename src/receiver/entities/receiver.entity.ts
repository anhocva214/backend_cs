import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("csedeli.receiver")
export class Receiver {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phoneNumber: string;

  @Column()
  email: string;
}
