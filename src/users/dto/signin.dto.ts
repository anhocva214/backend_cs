import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SignInDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
