import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderDimensionService } from './order-dimension.service';
import { CreateOrderDimensionDto } from './dto/create-order-dimension.dto';
import { UpdateOrderDimensionDto } from './dto/update-order-dimension.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('order-dimension')
@ApiTags('order-dimension')
export class OrderDimensionController {
  constructor(private readonly orderDimensionService: OrderDimensionService) { }

  @Post()
  create(@Body() createOrderDimensionDto: CreateOrderDimensionDto) {
    return this.orderDimensionService.create(createOrderDimensionDto);
  }

  @Get()
  findAll() {
    return this.orderDimensionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderDimensionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDimensionDto: UpdateOrderDimensionDto) {
    return this.orderDimensionService.update(+id, updateOrderDimensionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderDimensionService.remove(+id);
  }
}
