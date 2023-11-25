import { Module } from '@nestjs/common';
import { OrderPickupAddressService } from './order-pickup-address.service';
import { OrderPickupAddressController } from './order-pickup-address.controller';

@Module({
  controllers: [OrderPickupAddressController],
  providers: [OrderPickupAddressService]
})
export class OrderPickupAddressModule {}
