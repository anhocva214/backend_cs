import { Order } from "src/order/entities/order.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("csedeli.vehicle_type")
export class VehicleType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  weight: number;
  
  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column()
  price: number;

  @Column()
  image: string;

  @Column()
  description: string;
}
