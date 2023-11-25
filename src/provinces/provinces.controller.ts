import { Controller } from '@nestjs/common';
import { ProvincesService } from './provinces.service';

@Controller('provinces')
export class ProvincesController {
  constructor(private readonly provincesService: ProvincesService) {}
}
