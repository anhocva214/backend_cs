import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { DataSource, EntityManager, Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { Vehicle } from "./entities/vehicle.entity";
import { OrderDriverVehicle } from "src/order-driver-vehicle/entities/order-driver-vehicle.entity";
import { Order } from "src/order/entities/order.entity";
import { Users } from "src/users/entities/user.entity";


@Injectable()
export class VehicleRepository extends Repository<Vehicle> {
    constructor(private dataSource: DataSource){
        super(Vehicle, dataSource.createEntityManager());
    }

    async getVehicles(transactionManager: EntityManager){
        const query = await this.createQueryBuilder("vehicle")
                            .leftJoin('vehicle.status', 'status')
                            .leftJoin('vehicle.user', 'user')
                            .select(['vehicle', 'user', 'status'])
                            .orderBy('vehicle.id', 'ASC')
        
        return query.getMany(); 
    }

  async getVehicleList() {
    const query = await this.createQueryBuilder("vehicle")
      .orderBy('vehicle.id', 'DESC');
    return await query.getMany();
  }

  async findAllByDriver(req) {
    const order = req?.orderId;
    const driver = req?.driverId;
    if (driver) {
      var query = await this.createQueryBuilder("vehicle")
        .where('vehicle.user in '
          + this.createQueryBuilder("users").subQuery().select('s.id').from(Users, 's').where('s.id =' + driver).getQuery())
        .andWhere('vehicle.weight >=' + this.createQueryBuilder("users").subQuery().select('o.estWeight').from(Order, 'o').where('o.id =' + order).getQuery())
        .orderBy('vehicle.id', 'DESC');
      return await query.getMany();
    }
    else {
      var query = await this.createQueryBuilder("vehicle")
        .where('vehicle.user in '
          + this.createQueryBuilder("users").subQuery().select('s.driver').from(OrderDriverVehicle, 's').where('s.order =' + order).getQuery())
        .andWhere('vehicle.weight >=' + this.createQueryBuilder("users").subQuery().select('o.estWeight').from(Order, 'o').where('o.id =' + order).getQuery())
        .orderBy('vehicle.id', 'DESC');
      return await query.getMany();
    }
  }
}
