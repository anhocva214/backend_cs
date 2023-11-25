import { IsNumber, IsString } from "class-validator";

export class CreateServiceAdditionDto {
  @IsString()
  name: any;

  @IsNumber()
  price: number;

  @IsString()
  description: any;

  isActive: boolean;

  image: any;
}