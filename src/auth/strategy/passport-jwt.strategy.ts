import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {PayloadInterface} from "../interface/payload.interface";
import {UserService} from "../../user/user.service";
import {ProfesseurService} from "../../professeur/professeur.service";
import {EtudiantService} from "../../etudiant/etudiant.service";
import {Etudiant} from "../../etudiant/schema/etudiant.schema";
import {RoleEnum} from "../../user/enum/role.enum";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private config : ConfigService,
        private userService : UserService,
        private professeurService : ProfesseurService,
        private etudiantService : EtudiantService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get('SECRET'),
        });
    }

    async validate(payload: PayloadInterface) {
        const user = await this.userService.findByMail(payload.email)
        if (!user){
            throw new UnauthorizedException()
        }
        if(user.role==RoleEnum.ADMIN){
            return user
        }else if(user.role == RoleEnum.ETUDIANT){
            const etudiant : Etudiant = await this.etudiantService.findByMail(payload.email)
            return etudiant
        }else {
            const professeur = await this.professeurService.findByMail(payload.email)
            return professeur
        }
    }
}
