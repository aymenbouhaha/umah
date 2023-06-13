import { Module } from '@nestjs/common';
import { LeconService } from './lecon.service';
import { LeconController } from './lecon.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Lecon, LeconSchema} from "./schema/lecon.schema";
import {AppService} from "../app.service";
import {ProfesseurModule} from "../professeur/professeur.module";

@Module({
  imports : [
      ProfesseurModule,
    MongooseModule.forFeature([
      {name : Lecon.name , schema : LeconSchema}
    ])
  ],
  controllers: [LeconController],
  providers: [LeconService,AppService],
  exports: [LeconService]
})
export class LeconModule {}
