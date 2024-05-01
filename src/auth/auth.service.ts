import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {LoginDto} from "./dto/login.dto";
import * as bcrypt from 'bcrypt';
import {PayloadInterface} from "./interface/payload.interface";
import {JwtService} from "@nestjs/jwt";
import {RoleEnum} from "../user/enum/role.enum";
import {ProfesseurService} from "../professeur/professeur.service";
import {EtudiantService} from "../etudiant/etudiant.service";

@Injectable()
export class AuthService {

    constructor(
        private userService : UserService,
        private jwtService : JwtService,
        private profService : ProfesseurService,
        private etudiantService : EtudiantService
    ) {
    }


    async login(credentials: LoginDto) {
        const user =await this.userService.findUserByEmailWithPassword(credentials.email)
        console.log(user)
        if (!user) {
            throw new NotFoundException("Verifier votre mail")
        }
        const hashedPassword = await bcrypt.hash(credentials.password,user.salt)
        if (hashedPassword!=user.password){
            throw new BadRequestException("Verifier votre mail ou mot de passe")
        }
        const payload : PayloadInterface={
            email : user.email,
            address : user.address,
            firstname : user.firstname,
            lastname : user.lastname,
            phoneNumber : user.phoneNumber,
        }
        const token = this.jwtService.sign(payload)
        const decodedToken =this.jwtService.verify(token)
        let returnedUser
        if (user.role==RoleEnum.PROFESSEUR){
            const prof=await this.profService.findProf(user.email)
            returnedUser = prof
        }else if (user.role==RoleEnum.ETUDIANT){
            const etudiant=await this.etudiantService.findEtudiant(user.email)
            returnedUser=etudiant
        }
        return {
            user : returnedUser,
            access_token : token,
            expiry_date : decodedToken.exp
        }
    }





}
