import { Module } from '@nestjs/common';
import { ProfesseurService } from './professeur.service';
import { ProfesseurController } from './professeur.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Professeur, ProfesseurSchema} from "./schema/professeur.schema";
import {UserModule} from "../user/user.module";
import {InstrumentModule} from "../instrument/instrument.module";
import {AppService} from "../app.service";

@Module({
  imports : [
      UserModule,
      InstrumentModule,
      MongooseModule.forFeature([
        {name : Professeur.name, schema : ProfesseurSchema}
      ])
  ],
  controllers: [ProfesseurController],
  providers: [ProfesseurService, AppService],
  exports : [ProfesseurService]
})
export class ProfesseurModule {}
