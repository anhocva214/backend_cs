import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ServiceAdditionRepository } from './service-addition.repository';
import { EntityManager } from 'typeorm';
import { CreateServiceAdditionDto } from './dto/create-service-addition.dto';

@Injectable()
export class ServiceAdditionService {
    constructor(private serviceAdditionRepository: ServiceAdditionRepository){}

    async findAllServiceAddition(transactionManager: EntityManager){
        try {
            const serviceAddition = await this.serviceAdditionRepository.getAllServiceAddition(transactionManager);
            return {
                status: 200,
                data: {
                    serviceAddition,
                    total: serviceAddition.length,
                },
                message: "Get Additional Service List Successfully",
            };
        } catch (error) {
            throw new InternalServerErrorException("Error occurred while retrieving all additional services", error.message);
        }
    };

    async createServiceAddition(transactionManager: EntityManager, createServiceAdditionDto: CreateServiceAdditionDto){
        try {
            const serviceAddition = await this.serviceAdditionRepository.createServiceAddition(transactionManager, createServiceAdditionDto);
            if(serviceAddition){
                return {
                    statusCode: 200,
                    serviceAddition,
                    message: 'Additional service has been created! Please check in your additional services.'
                }
            }
        } catch (error) {
            throw new InternalServerErrorException('Error occurred while creating additional service', error.message);
        }
    }

}
