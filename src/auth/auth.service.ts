import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {LoginDto} from "./dto/login.dto";
import * as bcrypt from 'bcrypt';
import {PayloadInterface} from "./interface/payload.interface";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {

    constructor(
        private userService : UserService,
        private jwtService : JwtService
    ) {
    }


    async login(credentials: LoginDto) {
        const user =await this.userService.findUserByEmailWithPassword(credentials.email)
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
        return {
            ...payload,
            profileImage : user.profileImage,
            access_token : token
        }
    }





}
