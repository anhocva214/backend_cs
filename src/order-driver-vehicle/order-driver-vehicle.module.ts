import { Module } from '@nestjs/common';
import { OrderDriverVehicleService } from './order-driver-vehicle.service';
import { OrderDriverVehicleController } from './order-driver-vehicle.controller';
import { OrderDriverVehicleRepository } from './order-driver-vehicle.repository';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [OrderDriverVehicleController],
  providers: [OrderDriverVehicleService, OrderDriverVehicleRepository]
})
export class OrderDriverVehicleModule {}
