import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateVehicleTypeDto } from './dto/create-vehicle-type.dto';
import { UpdateVehicleTypeDto } from './dto/update-vehicle-type.dto';
import { EntityManager } from 'typeorm';
import { VehicleTypeRepository } from './vehicle-type.repository';

@Injectable()
export class VehicleTypeService {
  constructor(private vehicleTypeRepository: VehicleTypeRepository) {}

  create(createVehicleTypeDto: CreateVehicleTypeDto ) {
    return 'This action adds a new status';
  }

  async findAllVehicleType(transactionManager: EntityManager) {
    try {
      const vehicleType = await this.vehicleTypeRepository.getAllVehicleType(transactionManager);
      return {
        status: 200,
        data: {
          vehicleType,
          total: vehicleType.length,
        },
        message: "Get Vehicle List Successfully",
      };
    } catch (error) {
      throw new InternalServerErrorException("Error when retrieved all vehicle type", error.message);
    }
  }

  async createVehicleType(transactionManager: EntityManager, createVehicleTypeDto: CreateVehicleTypeDto){
    try {
        const vehicleType = await this.vehicleTypeRepository.createVehicleType(transactionManager, createVehicleTypeDto);
        if(vehicleType){
            return {
                statusCode: 200,
                vehicleType,
                message: 'Vehicle Type has been created! Please check your all vehicle types.'
            }
        }
    } catch (error) {
        throw new InternalServerErrorException('Error occurred while creating vehicle type', error.message);
    }
}

  findOne(id: number) {
    return `This action returns a #${id} status`;
  }

  update(id: number, updateVehicleTypeDto: UpdateVehicleTypeDto) {
    return `This action updates a #${id} status`;
  }

  remove(id: number) {
    return `This action removes a #${id} status`;
  }
}
