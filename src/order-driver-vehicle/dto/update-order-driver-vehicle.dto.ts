import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDriverVehicleDto } from './create-order-driver-vehicle.dto';

export class UpdateOrderDriverVehicleDto extends PartialType(CreateOrderDriverVehicleDto) {}
