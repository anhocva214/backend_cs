import { Controller } from '@nestjs/common';
import { OrderPickupAddressService } from './order-pickup-address.service';

@Controller('order-pickup-address')
export class OrderPickupAddressController {
  constructor(private readonly orderPickupAddressService: OrderPickupAddressService) {}
}
