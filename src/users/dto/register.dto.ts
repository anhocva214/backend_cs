import { IsString } from "class-validator";

export class RegisterDto {
  @IsString()
  fullName: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  phoneNumber: string;
}

