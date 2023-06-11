import { Controller } from '@nestjs/common';
import { DemandeService } from './demande.service';

@Controller('demande')
export class DemandeController {
  constructor(private readonly demandeService: DemandeService) {}
}
