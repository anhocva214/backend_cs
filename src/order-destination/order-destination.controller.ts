import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderDestinationService } from './order-destination.service';
import { CreateOrderDestinationDto } from './dto/create-order-destination.dto';
import { UpdateOrderDestinationDto } from './dto/update-order-destination.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('order-destination')
@ApiTags('order-destination')
export class OrderDestinationController {
  constructor(private readonly orderDestinationService: OrderDestinationService) { }

  @Post()
  create(@Body() createOrderDestinationDto: CreateOrderDestinationDto) {
    return this.orderDestinationService.create(createOrderDestinationDto);
  }

  @Get()
  findAll() {
    return this.orderDestinationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderDestinationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDestinationDto: UpdateOrderDestinationDto) {
    return this.orderDestinationService.update(+id, updateOrderDestinationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderDestinationService.remove(+id);
  }
}
