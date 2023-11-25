import { VehicleType } from './../../vehicle-type/entities/vehicle-type.entity';
import { OrderDimension } from 'src/order-dimension/entities/order-dimension.entity';
import { OrderDestination } from './../../order-destination/entities/order-destination.entity';
import { Status } from "src/status/entities/status.entity";
import { Users } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("csedeli.order")
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pickupLocation: string;
  
  @Column()
  statusId: number;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
  
  @Column()
  isThirdParty: boolean;

  @Column()
  estWeight: number;

  @Column()
  noteForDriver: string;

  @Column()
  typeOrder: number;

  @Column()
  userId: number;

  @Column()
  vehicleTypeId: number;

  @OneToOne(() => Status)
  @JoinColumn({ name: 'status_id', referencedColumnName: 'id' })
  status: Status;

  @OneToOne(() => Users)
  @JoinColumn({name: 'user_id', referencedColumnName: 'id'})
  user: Users;

  @OneToMany(() => OrderDestination, (orderDestination) => orderDestination.order)
  orderDestination: OrderDestination[];

  @OneToOne(() => OrderDimension, (orderDimension) => orderDimension.order)
  orderDimension: OrderDimension;

  @OneToOne(() => VehicleType)
  vehicleType: VehicleType;
}
