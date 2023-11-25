import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("csedeli.service_addition")
export class ServiceAddition {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  isActive: boolean;
  
  @Column()
  price: number;
  
  @Column()
  image: string;
  
  @Column()
  description: string;
  
  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
