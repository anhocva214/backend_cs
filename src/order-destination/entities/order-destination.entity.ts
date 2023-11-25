import { District } from "src/district/entities/district.entity";
import { Order } from "src/order/entities/order.entity";
import { Province } from "src/provinces/entities/provinces.entity";
import { Receiver } from "src/receiver/entities/receiver.entity";
import { Ward } from "src/ward/entities/ward.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("csedeli.order_destination")
export class OrderDestination {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  packageDestination: string;

  @Column()
  driverNote: string;

  @Column()
  deliveredAt: string;

  @Column()
  orderId: string;

  @Column()
  receiverId: string;

  @Column()
  streetNumber: string;

  @Column()
  streetName: string;

  @Column()
  wardId: string;

  @Column()
  districtId: string;

  @Column()
  provinceId: string;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
  order: Order;

  @OneToOne(() => Receiver)
  @JoinColumn({name: 'receiver_id', referencedColumnName: 'id'})
  receiver: Receiver;

  @OneToOne(() => Ward)
  @JoinColumn({name: 'ward_id', referencedColumnName: 'code'})
  ward: Ward;

  @OneToOne(() => District)
  @JoinColumn({name: 'district_id', referencedColumnName: 'code'})
  district: District;

  @OneToOne(() => Province)
  @JoinColumn({name: 'province_id', referencedColumnName: 'code'})
  province: Province;
}
