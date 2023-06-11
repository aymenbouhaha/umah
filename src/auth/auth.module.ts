import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import * as dotenv from "dotenv";
import {JwtStrategy} from "./strategy/passport-jwt.strategy";
import {UserModule} from "../user/user.module";
import {ProfesseurModule} from "../professeur/professeur.module";
import {EtudiantModule} from "../etudiant/etudiant.module";

dotenv.config()
@Module({
  imports : [
      UserModule,
      ProfesseurModule,
      EtudiantModule,
      PassportModule.register({
        defaultStrategy : "jwt"
      }),
      JwtModule.register({
          secret : process.env.SECRET,
          signOptions : {
              expiresIn : "15d"
          }
      })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
