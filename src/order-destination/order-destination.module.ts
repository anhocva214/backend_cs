import { Module } from '@nestjs/common';
import { OrderDestinationService } from './order-destination.service';
import { OrderDestinationController } from './order-destination.controller';

@Module({
  controllers: [OrderDestinationController],
  providers: [OrderDestinationService]
})
export class OrderDestinationModule {}
