import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Injectable,
} from "@nestjs/common";
import { VehicleTypeService } from "./vehicle-type.service";
import { UseGuards } from "@nestjs/common";
import { RolesGuard } from "src/guards/roles.guard";
import { ApiBearerAuth } from "@nestjs/swagger";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { CreateVehicleTypeDto } from "./dto/create-vehicle-type.dto";

@Controller("vehicle-type")
export class VehicleTypeController {
  @InjectDataSource("default") private dataSource: DataSource;
  constructor(private readonly vehicleTypeService: VehicleTypeService) {}

  @Get()
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  async findAllVehicle() {
    return await this.dataSource.transaction((transactionManager) => {
      return this.vehicleTypeService.findAllVehicleType(transactionManager);
    });
  }

  @Post()
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  async createServiceAddition(
    @Body() createVehicleTypeDto: CreateVehicleTypeDto
  ) {
    return await this.dataSource.transaction((transactionManager) => {
      return this.vehicleTypeService.createVehicleType(
        transactionManager,
        createVehicleTypeDto
      );
    });
  }
}
