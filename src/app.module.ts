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
import {MongooseModule} from "@nestjs/mongoose";
import {ConfigModule} from "@nestjs/config";
import {RequestLoggingInterceptor} from "./log.interceptor";
import {APP_INTERCEPTOR} from "@nestjs/core";

@Module({
  imports: [
      AuthModule,
      DemandeModule,
      EtudiantModule,
      InstrumentModule,
      LeconModule,
      ProfesseurModule,
      UserModule,
      MongooseModule.forRoot("mongodb+srv://chaimagharbi:NyGxMl8Wc8pxxjvd@cluster0.k6mgz30.mongodb.net/umah",),
      ConfigModule.forRoot({
          isGlobal : true
      }),
  ],
  controllers: [AppController],
  providers: [
      AppService,
      {
          provide: APP_INTERCEPTOR,
          useClass: RequestLoggingInterceptor,
      }
  ],
    exports: [AppService]
})
export class AppModule {}
