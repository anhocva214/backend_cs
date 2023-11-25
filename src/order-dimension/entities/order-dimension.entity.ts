import { Order } from "src/order/entities/order.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("csedeli.order_dimension")
export class OrderDimension {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderId: number;

  @Column()
  length: number;

  @Column()
  width: number;

  @Column()
  height: number;

  @OneToOne(() => Order)
  @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
  order: Order;
}
