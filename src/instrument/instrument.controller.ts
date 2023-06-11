import { Controller } from '@nestjs/common';
import { InstrumentService } from './instrument.service';

@Controller('instrument')
export class InstrumentController {
  constructor(private readonly instrumentService: InstrumentService) {}
}
