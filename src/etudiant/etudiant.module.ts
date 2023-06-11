import { Module } from '@nestjs/common';
import { EtudiantService } from './etudiant.service';
import { EtudiantController } from './etudiant.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Etudiant, EtudiantSchema} from "./schema/etudiant.schema";
import {UserModule} from "../user/user.module";

@Module({
  imports : [
      UserModule,
      MongooseModule.forFeature([
        {name : Etudiant.name,schema : EtudiantSchema}
      ])
  ],
  controllers: [EtudiantController],
  providers: [EtudiantService],
  exports : [EtudiantService]
})
export class EtudiantModule {}
