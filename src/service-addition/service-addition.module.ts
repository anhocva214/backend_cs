import { Module } from '@nestjs/common';
import { ServiceAdditionService } from './service-addition.service';
import { ServiceAdditionController } from './service-addition.controller';
import { ServiceAdditionRepository } from './service-addition.repository';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [ServiceAdditionService, ServiceAdditionRepository],
  controllers: [ServiceAdditionController],
  imports: [UsersModule],
  exports: [ServiceAdditionService, ServiceAdditionRepository]
})
export class ServiceAdditionModule {}
