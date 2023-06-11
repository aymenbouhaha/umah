import { Module } from '@nestjs/common';
import { LeconService } from './lecon.service';
import { LeconController } from './lecon.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Lecon, LeconSchema} from "./schema/lecon.schema";

@Module({
  imports : [
    MongooseModule.forFeature([
      {name : Lecon.name , schema : LeconSchema}
    ])
  ],
  controllers: [LeconController],
  providers: [LeconService]
})
export class LeconModule {}
