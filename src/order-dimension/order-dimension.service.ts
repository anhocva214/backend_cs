import { Injectable } from '@nestjs/common';
import { CreateOrderDimensionDto } from './dto/create-order-dimension.dto';
import { UpdateOrderDimensionDto } from './dto/update-order-dimension.dto';

@Injectable()
export class OrderDimensionService {
  create(createOrderDimensionDto: CreateOrderDimensionDto) {
    return 'This action adds a new orderDimension';
  }

  findAll() {
    return `This action returns all orderDimension`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orderDimension`;
  }

  update(id: number, updateOrderDimensionDto: UpdateOrderDimensionDto) {
    return `This action updates a #${id} orderDimension`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderDimension`;
  }
}
