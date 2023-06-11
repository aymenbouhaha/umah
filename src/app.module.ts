import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DemandeModule } from './demande/demande.module';
import { EtudiantModule } from './etudiant/etudiant.module';
import { InstrumentModule } from './instrument/instrument.module';
import { LeconModule } from './lecon/lecon.module';
import { ProfesseurModule } from './professeur/professeur.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, DemandeModule, EtudiantModule, InstrumentModule, LeconModule, ProfesseurModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
