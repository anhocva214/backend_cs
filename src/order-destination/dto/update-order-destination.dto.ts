import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDestinationDto } from './create-order-destination.dto';

export class UpdateOrderDestinationDto extends PartialType(CreateOrderDestinationDto) {}
