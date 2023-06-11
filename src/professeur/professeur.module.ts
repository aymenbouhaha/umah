import { Module } from '@nestjs/common';
import { ProfesseurService } from './professeur.service';
import { ProfesseurController } from './professeur.controller';

@Module({
  controllers: [ProfesseurController],
  providers: [ProfesseurService]
})
export class ProfesseurModule {}
