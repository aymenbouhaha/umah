import { Controller } from '@nestjs/common';
import { ProfesseurService } from './professeur.service';

@Controller('professeur')
export class ProfesseurController {
  constructor(private readonly professeurService: ProfesseurService) {}
}
