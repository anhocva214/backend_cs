import { Controller, Get, UseGuards, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ServiceAdditionService } from './service-addition.service';
import { RolesGuard } from 'src/guards/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateServiceAdditionDto } from './dto/create-service-addition.dto';

@Controller('service-addition')
export class ServiceAdditionController {
    @InjectDataSource("default") private dataSource: DataSource;
    constructor(private readonly serviceAdditionService: ServiceAdditionService){}

    @Get()
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    async findAllServiceAddition() {
        return await this.dataSource.transaction((transactionManager) => {
            return this.serviceAdditionService.findAllServiceAddition(transactionManager);
        });
    }
    
    @Post()
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    async createServiceAddition(@Body() createServiceAdditionDto: CreateServiceAdditionDto){
        return await this.dataSource.transaction((transactionManager) => {
            return this.serviceAdditionService.createServiceAddition(transactionManager, createServiceAdditionDto);
        });
    }
}
