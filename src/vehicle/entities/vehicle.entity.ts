import { Status } from "src/status/entities/status.entity";
import { Users } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { VehicleType } from "src/vehicle-type/entities/vehicle-type.entity";

@Entity("csedeli.vehicle")
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  weight: number;

  @Column()
  isActive: boolean;

  @Column()
  userId: number;
  
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

  @Column()
  statusId: number;
  
  @OneToOne(() => Users)
  @JoinColumn({name: 'user_id', referencedColumnName: 'id'})
  user: Users;

  @OneToOne(() => Status)
  @JoinColumn({ name: 'status_id', referencedColumnName: 'id' })
  status: Status;
  
  @OneToOne(() => VehicleType)
  @JoinColumn({name: 'type_id', referencedColumnName: 'id'})
  type: VehicleType;
}
