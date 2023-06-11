import { Controller } from '@nestjs/common';
import { EtudiantService } from './etudiant.service';

@Controller('etudiant')
export class EtudiantController {
  constructor(private readonly etudiantService: EtudiantService) {}
}
