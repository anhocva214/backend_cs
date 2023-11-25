import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class GetListDto {
  @IsNumber()
  @IsNotEmpty()
  page: number;

  @IsNumber()
  @IsNotEmpty()
  perPage: number;

  @IsString()
  filter?: string;

  @IsString()
  sort?: string;

  @IsString()
  fullTextSearch?: string;
}
