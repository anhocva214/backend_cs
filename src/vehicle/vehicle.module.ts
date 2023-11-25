import { Module } from '@nestjs/common';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';
import { VehicleRepository } from './vehicle.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [VehicleController], 
  providers: [VehicleService, VehicleRepository],
  imports: [UsersModule],
  exports: [VehicleService, VehicleRepository]
})
export class VehicleModule {}
