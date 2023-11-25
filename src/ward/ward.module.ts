import { Module } from '@nestjs/common';
import { WardService } from './ward.service';
import { WardController } from './ward.controller';
import { WardRepository } from './ward.repository';

@Module({
  controllers: [WardController],
  providers: [WardService, WardRepository],
})
export class WardModule {}
