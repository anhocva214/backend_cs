import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderDriverVehicleDto } from './dto/create-order-driver-vehicle.dto';
import { UpdateOrderDriverVehicleDto } from './dto/update-order-driver-vehicle.dto';
import { OrderDriverVehicleRepository } from './order-driver-vehicle.repository';

@Injectable()
export class OrderDriverVehicleService {
  constructor(
    private orderDriverVehicleRepository: OrderDriverVehicleRepository
  ) { }

  async create(transactionManager, createOrderDriverVehicleDto) {
    try {
      const findOrderDriverVehicle = await this.orderDriverVehicleRepository.getFromOrderId(createOrderDriverVehicleDto.orderId);
      if (findOrderDriverVehicle.length) {
        const orderDriverVehicleUpdate = await this.orderDriverVehicleRepository.updateFromOrderId(transactionManager, createOrderDriverVehicleDto.orderId, createOrderDriverVehicleDto);
        if (orderDriverVehicleUpdate) {
          return {
            statusCode: 200,
            orderDriverVehicle: orderDriverVehicleUpdate,
            message: 'Update order_driver_vehicle  successfully!'
          }
        }
      }
      else {
        const orderDriverVehicle = await this.orderDriverVehicleRepository.createOrderDriverVehicle(transactionManager, createOrderDriverVehicleDto);
        if (orderDriverVehicle) {
          return {
            statusCode: 200,
            orderDriverVehicle: orderDriverVehicle,
            message: 'Insert order_driver_vehicle  successfully!'
          }
        }
      }
    } catch (err) {
      throw new InternalServerErrorException('Error while inserting order_driver_vehicle', err.message);
    }
  }

  async getFromOrderId(id) {
    try {
      const orderDriverVehicle = await this.orderDriverVehicleRepository.getFromOrderId(id);
      if (orderDriverVehicle) {

        return {
          statusCode: 200,
          orderDriverVehicle: orderDriverVehicle,
          message: 'Get order_driver_vehicle  successfully!'
        }
      }
    } catch (err) {
      throw new InternalServerErrorException('Error while get order_driver_vehicle', err.message);
    }
  }

  async deleteAssignedOrderDriverVehicle(transactionManager, createOrderDriverVehicleDto) {
    try {
      const findOrderDriverVehicle = await this.orderDriverVehicleRepository.getFromOrderId(createOrderDriverVehicleDto.orderId);
      if (findOrderDriverVehicle.length) {
        const deleteAssignedOrderDriverVehicle = await this.orderDriverVehicleRepository.deleteAssignedOrderDriverVehicle(transactionManager, createOrderDriverVehicleDto.orderId, createOrderDriverVehicleDto);
        if (deleteAssignedOrderDriverVehicle ) {
          return {
            statusCode: 200,
            message: 'Delete assigned order_driver_vehicle  successfully!'
          }
        }
      }
    } catch (err) {
      throw new InternalServerErrorException('Error while deleting assgined order_driver_vehicle', err.message);
    }
  }

  async getFromDriverId(user) {
    try {
      const userId = user.id;
      console.log(userId);
      const orderDriverVehicle = await this.orderDriverVehicleRepository.getFromDriverId(userId);
      if (orderDriverVehicle) {

        return {
          statusCode: 200,
          orderDriverVehicle: orderDriverVehicle,
          message: 'Get order_driver_vehicle  successfully!'
        }
      }
    } catch (err) {
      throw new InternalServerErrorException('Error while get order_driver_vehicle', err.message);
    }
  }
}
