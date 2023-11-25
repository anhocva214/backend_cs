import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { VehicleService } from "./vehicle.service";
import { CreateVehicleDto } from "./dto/create-vehicle.dto";
import { UpdateVehicleDto } from "./dto/update-vehicle.dto";
import { GetUser } from "src/users/users.decorator";
import { RolesGuard } from "src/guards/roles.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { Users } from "src/users/entities/user.entity";

@Controller("vehicle")
@ApiTags("vehicle")
export class VehicleController {
  @InjectDataSource("default") private dataSource: DataSource;
  constructor(private readonly vehicleService: VehicleService) { }

  @Get()
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  async findAllVehicle() {
    return await this.dataSource.transaction((transactionManager) => {
      return this.vehicleService.findAll(transactionManager);
    });
  }

  @Post()
  async create(@Body() createVehicleDto: CreateVehicleDto) {
    return await this.vehicleService.create(createVehicleDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  async findAll(@GetUser() user: Users) {
    return await this.vehicleService.findAll(user);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.vehicleService.findOne(+id);
  // }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    return await this.vehicleService.update(+id, updateVehicleDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return await this.vehicleService.remove(+id);
  }

  @Get('/find-by-driver')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  findAllByDriver(@Req() req, @GetUser() user: Users) {
    return this.vehicleService.findAllByDriver(req.query, user);
  }
}
