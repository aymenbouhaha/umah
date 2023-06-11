import {BadRequestException, ConflictException, Injectable, UnauthorizedException} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {InjectModel} from "@nestjs/mongoose";
import {Etudiant, EtudiantDocument} from "./schema/etudiant.schema";
import {Model} from "mongoose";
import * as bcrypt from 'bcrypt';
import {SignUpDto} from "../user/dto/sign-up.dto";
import {RoleEnum} from "../user/enum/role.enum";
import {User} from "../user/schema/user.schema";
import {UpdateUserDto} from "../user/dto/update-user.dto";

@Injectable()
export class EtudiantService {


    constructor(
        private userService : UserService,
        @InjectModel(Etudiant.name)
        private etudiantModel : Model<EtudiantDocument>
    ) {
    }


    async signUpStudent(etudiantSignUpDto : SignUpDto){
        const user=await this.userService.findUserByEmailWithPassword(etudiantSignUpDto.email)
        if (user){
            throw new BadRequestException("Un utilisateur avec ce mail existe deja")
        }
        const salt = await bcrypt.genSalt();
        const password = await bcrypt.hash(etudiantSignUpDto.password,salt)
        const etudiant=new this.etudiantModel({
            ...etudiantSignUpDto,
            password : password,
            salt : salt,
            role : RoleEnum.ETUDIANT
        })
        const userSignUpDto : SignUpDto={
            ...etudiantSignUpDto,
            password : password,
        }
        try {
            await this.userService.signUpUser(userSignUpDto,RoleEnum.ETUDIANT, salt)
        }catch (e) {
            throw e
        }
        return await etudiant.save()
    }


    findByMail(email: string) : Promise<Etudiant> {
        return this.etudiantModel.findOne({email: email},{password : 0 , salt : 0});
    }



    findAll(){
        return this.etudiantModel.find({},{password : 0, salt : 0})
    }


    async updateEtudiant(user: Partial<User>, updateEtudiantDto: UpdateUserDto) {
        if (user.role != RoleEnum.ETUDIANT) {
            throw new UnauthorizedException()
        }
        try {
            const newEtudiant = await this.etudiantModel.updateOne(
                {email : user.email},
                {...updateEtudiantDto},
                {
                    new : true
                }
            ).projection({password : 0 , salt : 0}).exec()
            const newUser = await this.userService.updateUser(user, updateEtudiantDto)
            return newEtudiant
        }catch (e) {
            throw new ConflictException("Une erreur est survenue veuillez réessayer")
        }
    }


    async deleteEtudiant(user : Partial<User>){
        if (user.role != RoleEnum.ETUDIANT){
            throw new UnauthorizedException()
        }
        try {
            const deletedEtudiant = await this.etudiantModel.deleteOne({email : user.email}).exec()
            const deletedUser = await this.userService.deleteUser(user)
            return deletedEtudiant
        }catch (e) {
            throw new ConflictException("Une erreur est survenue veuillez réessayer")
        }
    }


}
