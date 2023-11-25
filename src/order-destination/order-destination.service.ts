import { Injectable } from '@nestjs/common';
import { CreateOrderDestinationDto } from './dto/create-order-destination.dto';
import { UpdateOrderDestinationDto } from './dto/update-order-destination.dto';

@Injectable()
export class OrderDestinationService {
  create(createOrderDestinationDto: CreateOrderDestinationDto) {
    return 'This action adds a new orderDestination';
  }

  findAll() {
    return `This action returns all orderDestination`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orderDestination`;
  }

  update(id: number, updateOrderDestinationDto: UpdateOrderDestinationDto) {
    return `This action updates a #${id} orderDestination`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderDestination`;
  }
}
