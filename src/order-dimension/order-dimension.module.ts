import { Module } from '@nestjs/common';
import { OrderDimensionService } from './order-dimension.service';
import { OrderDimensionController } from './order-dimension.controller';

@Module({
  controllers: [OrderDimensionController],
  providers: [OrderDimensionService]
})
export class OrderDimensionModule {}
