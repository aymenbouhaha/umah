import { Module } from '@nestjs/common';
import { DemandeService } from './demande.service';
import { DemandeController } from './demande.controller';

@Module({
  controllers: [DemandeController],
  providers: [DemandeService]
})
export class DemandeModule {}
