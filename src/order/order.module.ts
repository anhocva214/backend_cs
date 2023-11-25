import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { UsersModule } from 'src/users/users.module';
import { OrderRepository } from './order.repository';
import { WardModule } from 'src/ward/ward.module';
import { WardRepository } from 'src/ward/ward.repository';

@Module({
  imports: [UsersModule, WardModule],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, WardRepository]
})
export class OrderModule {}
