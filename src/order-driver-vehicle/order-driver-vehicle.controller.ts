import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ExecutionContext } from '@nestjs/common';
import { OrderDriverVehicleService } from './order-driver-vehicle.service';
import { CreateOrderDriverVehicleDto } from './dto/create-order-driver-vehicle.dto';
import { UpdateOrderDriverVehicleDto } from './dto/update-order-driver-vehicle.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { RolesGuard } from 'src/guards/roles.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { GetUser } from 'src/users/users.decorator'
import { Users } from "src/users/entities/user.entity";

@Controller('order-driver-vehicle')
@ApiTags('order-driver-vehicle')
export class OrderDriverVehicleController {
  @InjectDataSource("default") private dataSource: DataSource
  constructor(private readonly orderDriverVehicleService: OrderDriverVehicleService) { }
  @Post('/assign')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  async create(@Body() createOrderDriverVehicleDto, @GetUser() user) {
    return await this.dataSource.transaction((transactionManager) => {
      return this.orderDriverVehicleService.create(transactionManager, createOrderDriverVehicleDto);
    });
  }

  @Get('/order/:id')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  async getFromOrderId(@Param('id') id: string, @GetUser() user) {
    return this.orderDriverVehicleService.getFromOrderId(id);
  }

  @Post('/assign/delete')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  async deleteAssignedOrderDriverVehicle(@Body() createOrderDriverVehicleDto, @GetUser() user) {
    return await this.dataSource.transaction((transactionManager) => {
      return this.orderDriverVehicleService.deleteAssignedOrderDriverVehicle(transactionManager, createOrderDriverVehicleDto);
    });
  }

  @Get('/driver')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  async getFromDriverId(@GetUser() user) {
    return this.orderDriverVehicleService.getFromDriverId(user);
  }

}
