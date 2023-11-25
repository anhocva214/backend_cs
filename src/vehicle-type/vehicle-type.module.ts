import { Module } from '@nestjs/common';
import { VehicleTypeService } from './vehicle-type.service';
import { VehicleTypeController } from './vehicle-type.controller';
import { UsersModule } from 'src/users/users.module';
import { VehicleTypeRepository } from './vehicle-type.repository';

@Module({
  controllers: [VehicleTypeController],
  providers: [VehicleTypeService, VehicleTypeRepository],
  imports: [UsersModule],
  exports: [VehicleTypeService, VehicleTypeRepository]
})
export class VehicleTypeModule {}
