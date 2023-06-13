import {BadRequestException, ConflictException, Injectable, UnauthorizedException} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {InjectModel} from "@nestjs/mongoose";
import {Etudiant, EtudiantDocument} from "./schema/etudiant.schema";
import mongoose, {Model} from "mongoose";
import * as bcrypt from 'bcrypt';
import {SignUpDto} from "../user/dto/sign-up.dto";
import {RoleEnum} from "../user/enum/role.enum";
import {User} from "../user/schema/user.schema";
import {UpdateUserDto} from "../user/dto/update-user.dto";
import {ChangePasswordDto} from "../user/dto/change-password.dto";

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



    async addProfilePicture(user: Partial<User>, image: Express.Multer.File) {
        const profileImage = this.userService.resolveProfileImage(image)
        try {
            await this.userService.addProfilePicture(user.email,profileImage)
            return await this.etudiantModel.updateOne({email : user.email},{profileImage: profileImage}).exec()
        } catch (e) {
            throw new ConflictException("Une Erreur est survenue")
        }
    }


    async changePassword(user: Partial<User>, changePasswordDto: ChangePasswordDto) {
        const etudiant = await this.etudiantModel.findOne({email : user.email})
        const previousPasswordHashed= await bcrypt.hash(changePasswordDto.previousPassword,etudiant.salt)
        if (previousPasswordHashed!=etudiant.password){
            throw new BadRequestException("Mot de passe invalide")
        }
        const newPasswordHashed= await bcrypt.hash(changePasswordDto.newPassword,etudiant.salt)
        try {
            await this.userService.changePassword(user.email,newPasswordHashed)
            return await this.etudiantModel.updateOne({email : user.email},{password : newPasswordHashed})

        }catch (e) {
            throw new ConflictException("Une erreur est survenue")
        }
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
                    projection : {password : 0 , salt : 0},
                    new : true
                }
            ).exec()
            const newUser = await this.userService.updateUser(user, updateEtudiantDto)
            return newEtudiant
        }catch (e) {
            console.log(e)
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
