import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDimensionDto } from './create-order-dimension.dto';

export class UpdateOrderDimensionDto extends PartialType(CreateOrderDimensionDto) {}
