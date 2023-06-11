import { Module } from '@nestjs/common';
import { DemandeService } from './demande.service';
import { DemandeController } from './demande.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Demande, DemandeSchema} from "./schema/demande.schema";
import {ProfesseurModule} from "../professeur/professeur.module";
import {InstrumentModule} from "../instrument/instrument.module";
import {AppService} from "../app.service";
import {LeconModule} from "../lecon/lecon.module";

@Module({
  imports : [
      InstrumentModule,
      ProfesseurModule,
      LeconModule,
      MongooseModule.forFeature([
        {name : Demande.name, schema: DemandeSchema}
      ])
  ],
  controllers: [DemandeController],
  providers: [DemandeService, AppService],
    exports: [DemandeService]
})
export class DemandeModule {}
