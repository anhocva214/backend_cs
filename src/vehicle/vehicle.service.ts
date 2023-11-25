import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { VehicleRepository } from "./vehicle.repository";
import { Vehicle } from "./entities/vehicle.entity";
import { CreateVehicleDto } from "./dto/create-vehicle.dto";
import { UpdateVehicleDto } from "./dto/update-vehicle.dto";

@Injectable()
export class VehicleService {
  constructor(private vehicleRepository: VehicleRepository) {}
  async findAllVehicle(transactionManager: EntityManager) {
    try {
      const vehicle = await this.vehicleRepository.getVehicles(
        transactionManager
      );
      return {
        status: 200,
        data: {
          vehicle,
          total: vehicle.length,
        },
        message: "Get Vehicle List Successfully",
      };
    } catch (error) {
      throw new InternalServerErrorException(
        "Error when retrieved all vehicle",
        error.message
      );
    }
  }
  create(createVehicleDto: CreateVehicleDto) {
    return "This action adds a new status";
  }

  async findAll(user) {
    try {
      const vehicle = await this.vehicleRepository.getVehicleList();
      return {
        status: 200,
        data: { vehicle: vehicle },
        message: "Get Vehicle List Successfully",
      };
    } catch (err) {
      throw new InternalServerErrorException(
        "Lỗi trong quá trình lay danh sach vehicle",
        err.message
      );
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} status`;
  }

  update(id: number, updateVehicleDto: UpdateVehicleDto) {
    return `This action updates a #${id} status`;
  }

  remove(id: number) {
    return `This action removes a #${id} status`;
  }

  async findAllByDriver(req, user) {
    try {
      const vehicle = await this.vehicleRepository.findAllByDriver(req)
      return {
        status: 200,
        data: { vehicle: vehicle },
        message: 'Get Vehicle List Successfully'
      };
    } catch (err) {
      throw new InternalServerErrorException('Lỗi trong quá trình lay danh sach vehicle', err.message);
    }
  }
}
