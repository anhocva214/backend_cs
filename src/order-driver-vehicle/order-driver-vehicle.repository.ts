import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { DataSource, EntityManager, Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { OrderDriverVehicle } from "./entities/order-driver-vehicle.entity";
import { CreateOrderDriverVehicleDto } from "./dto/create-order-driver-vehicle.dto";
import { JwtService } from "@nestjs/jwt";
import { Status } from "src/status/entities/status.entity";

@Injectable()
export class OrderDriverVehicleRepository extends Repository<OrderDriverVehicle> {
    constructor(private dataSource: DataSource) {
        super( OrderDriverVehicle, dataSource.createEntityManager());
    }

    async createOrderDriverVehicle(transactionManager, createOrderDriverVehicleDto) {
        const {
            orderId,
            driverId,
            vehicleId
        } = createOrderDriverVehicleDto;
        const createOrderDriverVehicle = await transactionManager.create(OrderDriverVehicle, {
            order : orderId,
            driver: driverId,
            vehicle: vehicleId
        })

        const createOrderDriverVehiclCreated = await transactionManager.save(createOrderDriverVehicle)

        return createOrderDriverVehiclCreated;
    }

    async getFromOrderId(id) {
        const query = await this.createQueryBuilder("orderDriverVehicle")
            .leftJoin('orderDriverVehicle.order', 'order')
            .leftJoin('orderDriverVehicle.vehicle', 'vehicle')
            .leftJoin('orderDriverVehicle.driver', 'users')
            .select(["order", 'vehicle', 'users', 'orderDriverVehicle'])
            .where(`orderDriverVehicle.order = '${id}'`);
        return await query.getMany();
    }

    async updateFromOrderId(transactionManager, id , dto) {
        const driverId = dto.driverId;
        const vehicleId =  dto.vehicleId;
        const data = {
            driver: driverId,
            vehicle: vehicleId
        }
        const result = await transactionManager.update(OrderDriverVehicle, {order : id}, data);
        return result;
    }

    async deleteAssignedOrderDriverVehicle(transactionManager, id , dto) {
        const result = await transactionManager.delete(OrderDriverVehicle, {order : id});
        return result;
    }

    async getFromDriverId(id) {
        const query = await this.createQueryBuilder("orderDriverVehicle")
            .leftJoin('orderDriverVehicle.order', 'order')
            .leftJoin('order.status', 'status')
            .leftJoin('orderDriverVehicle.vehicle', 'vehicle')
            .leftJoin('orderDriverVehicle.driver', 'users')
            .select(["order", 'vehicle', 'users', 'orderDriverVehicle', 'status'])
            .where(`orderDriverVehicle.driver = '${id}'`);
        return await query.getMany();
    }
}
