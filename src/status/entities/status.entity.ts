import { Order } from "src/order/entities/order.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("csedeli.status")
export class Status {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: string;
}
