import { Order } from "src/order/entities/order.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Vehicle } from "src/vehicle/entities/vehicle.entity";
import { Users } from "src/users/entities/user.entity";

@Entity("csedeli.order_driver_vehicle")
export class OrderDriverVehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Order)
  @JoinColumn({name: 'order_id', referencedColumnName: 'id'})
  order: Order;

  @OneToOne(() => Users)
  @JoinColumn({name: 'driver_id', referencedColumnName: 'id'})
  driver: Users;

  @OneToOne(() => Vehicle)
  @JoinColumn({name: 'vehicle_id', referencedColumnName: 'id'})
  vehicle: Vehicle;
}
