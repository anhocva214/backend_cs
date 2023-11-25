import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { DataSource, EntityManager, Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { VehicleType } from "./entities/vehicle-type.entity";
import { OrderDriverVehicle } from "src/order-driver-vehicle/entities/order-driver-vehicle.entity";
import { Order } from "src/order/entities/order.entity";
import { Users } from "src/users/entities/user.entity";
import { CreateVehicleTypeDto } from "./dto/create-vehicle-type.dto";


@Injectable()
export class VehicleTypeRepository extends Repository<VehicleType> {
    constructor(private dataSource: DataSource){
        super(VehicleType, dataSource.createEntityManager());
    }

    async getAllVehicleType(transactionManager: EntityManager){
        const query = await this.createQueryBuilder("vehicleType")
                            .select(['vehicleType'])
                            .orderBy('vehicleType.id', 'ASC')
        
        return query.getMany(); 
    }

    async createVehicleType(transactionManager: EntityManager, createVehicleTypeDto: CreateVehicleTypeDto){
        const {
            name,
            price,
            description,
            image,
            weight
        } = createVehicleTypeDto;

        const vehicleType = await transactionManager.create(VehicleType, {
            name: name,
            price: price,
            description: description,
            weight: weight,
            image: image,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await transactionManager.save(vehicleType);

        return vehicleType;
    }
}