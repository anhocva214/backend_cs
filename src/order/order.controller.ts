import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ExecutionContext, Req, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { GetUser } from 'src/users/users.decorator'
import { Users } from "src/users/entities/user.entity";
import { Request } from 'express';
import { RolesGuard } from "src/guards/roles.guard";
import { Status } from 'src/status/entities/status.entity';

@Controller('order')
@ApiTags('order')
export class OrderController {
  @InjectDataSource("default") private dataSource: DataSource
  constructor(private readonly orderService: OrderService) { }

  @Post()
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  async create(@Body() createOrderDto: CreateOrderDto, @GetUser() user) {
    return await this.dataSource.transaction((transactionManager) => {
      return this.orderService.create(transactionManager, createOrderDto, user);
    });
  }

  @Get('/tracking/:id')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  async trackingOrder(@Param('id') id: string, @GetUser() user) {
    return await this.orderService.trackingOrder(+id, user);
  }

  @Get("")
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  async findAll(@GetUser() user: Users) {
    return await this.dataSource.transaction((transactionManager) => {
      return this.orderService.findAll(transactionManager, user);
    });
  }

  @Get('/sort')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  async findAllSortOrder(@GetUser() user: Users, @Param('order') order: string) {
    // const sort: any = req.query.sort;
    // const temp: any = 'ASC' || 'DESC';
    if (order != 'ASC' && order != 'DESC') order = 'DESC';

    return await this.dataSource.transaction((transactionManager) => {
      return this.orderService.findAllSortOrder(transactionManager, user, order);
    });
  }

  @Get('/filter')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  async findAllFilter(@GetUser() user: Users, @Query('status') status: string, @Query('weight') weight: number, @Req() req: Request) {
    const param1 = req.query.param1;
    const param2 = req.query.param2;

    return await this.dataSource.transaction((transactionManager) => {
      return this.orderService.findAllFilter(transactionManager, user, status, weight);
    });
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  findOne(@Param('id') id: string, @GetUser() user) {
    return this.orderService.findOne(+id, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }

  @Post('/update/:id')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  async updateOrderDetail(@Param('id') id: string, @Body() updateOrderDto) {
    return await this.dataSource.transaction((transactionManager) => {
      return this.orderService.updateOrderDetail(transactionManager, +id, updateOrderDto);
    });
  }

  @Patch('/cancel/:id')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  async cancelOrder(@Param('id') id: string) {
    return await this.dataSource.transaction((transactionManager) => {
      return this.orderService.cancelOrder(transactionManager, +id);
    })
  }

  @Get('/admin/list')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  async adminFindAll(@GetUser() user: Users) {
    return await this.dataSource.transaction((transactionManager) => {
      return this.orderService.adminFindAll(transactionManager, user);
    });
  }

  @Get('/admin/:id')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  adminFindOne(@Param('id') id: string, @GetUser() user) {
    return this.orderService.adminFindOne(+id, user);
  }
}
