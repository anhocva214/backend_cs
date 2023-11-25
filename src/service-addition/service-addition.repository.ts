import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { DataSource, EntityManager, Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { OrderDriverVehicle } from "src/order-driver-vehicle/entities/order-driver-vehicle.entity";
import { Order } from "src/order/entities/order.entity";
import { Users } from "src/users/entities/user.entity";
import { ServiceAddition } from "./entity/service-addition.entity";
import { CreateServiceAdditionDto } from "./dto/create-service-addition.dto";


@Injectable()
export class ServiceAdditionRepository extends Repository<ServiceAddition> {
    constructor(private dataSource: DataSource){
        super(ServiceAddition, dataSource.createEntityManager());
    }

    async getAllServiceAddition(transactionManager: EntityManager){
        const query = await this.createQueryBuilder("serviceAddition")
                            .select(['serviceAddition'])
                            .where(`serviceAddition.is_active = true`)
                            .orderBy('serviceAddition.id', 'ASC')
        
        return query.getMany(); 
    }

    async createServiceAddition(transactionManager: EntityManager, createServiceAdditionDto: CreateServiceAdditionDto){
        const {
            name,
            price,
            description,
            image,
            isActive
        } = createServiceAdditionDto;

        const serviceAddition = await transactionManager.create(ServiceAddition, {
            name: name,
            price: price,
            description: description,
            isActive: true,
            image: image,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await transactionManager.save(serviceAddition);

        return serviceAddition;
    }
}