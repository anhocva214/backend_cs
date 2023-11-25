import { IsNumber, IsString } from "class-validator";

export class CreateVehicleTypeDto {
  @IsString()
  name: any;

  @IsNumber()
  price: number;

  @IsString()
  description: any;

  @IsNumber()
  weight: number;

  image: any;
}