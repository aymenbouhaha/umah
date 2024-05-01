import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {InjectModel} from "@nestjs/mongoose";
import {Etudiant, EtudiantDocument} from "./schema/etudiant.schema";
import  {Model} from "mongoose";
import * as bcrypt from 'bcrypt';
import {SignUpDto} from "../user/dto/sign-up.dto";
import {RoleEnum} from "../user/enum/role.enum";
import {User} from "../user/schema/user.schema";
import {UpdateUserDto} from "../user/dto/update-user.dto";
import {ChangePasswordDto} from "../user/dto/change-password.dto";
import {AssginInstrumentDto} from "../professeur/dto/assgin-instrument.dto";
import {Instrument} from "../instrument/schema/instrument.schema";
import {AppService} from "../app.service";
import {InstrumentService} from "../instrument/instrument.service";
import {Professeur} from "../professeur/schema/professeur.schema";

@Injectable()
export class EtudiantService {


    constructor(
        private userService : UserService,
        @InjectModel(Etudiant.name)
        private etudiantModel : Model<EtudiantDocument>,
        private appService : AppService,
        private instrumentService : InstrumentService
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

    findEtudiant(email :string){
        return this.etudiantModel.findOne({email : email}, {password: 0, salt : 0},{populate : ["instruments"]})
    }



    async addProfilePicture(user: Partial<User>, image: Express.Multer.File) {
        const profileImage = this.userService.resolveProfileImage(image)
        try {
            await this.userService.addProfilePicture(user.email,profileImage)
            await this.etudiantModel.updateOne({email : user.email},{profileImage: profileImage}).exec()
            return {
                profileImage : profileImage
            }
        } catch (e) {
            throw new ConflictException("Une Erreur est survenue")
        }
    }

    async assignInstrument(user: Partial<User>, instrumentsDto: AssginInstrumentDto) {
        if (user.role != RoleEnum.ETUDIANT) {
            throw new UnauthorizedException()
        }
        instrumentsDto.idList.forEach((id)=>{
            if (!this.appService.isObjectIdValid(id)){
                throw new BadRequestException("L'un des id est invalide")
            }
        })
        const instruments : Instrument[]=await this.instrumentService.getInstrumentsMatchingIds(instrumentsDto.idList)
        if (instruments.length!=instrumentsDto.idList.length){
            throw new NotFoundException("Au moins l'un des instruments n'existe pas")
        }
        try {
            await this.etudiantModel.updateOne({email : user.email},
                {$push : {instruments : {$each : instruments }}},
                {new : true})
                .exec()
            return instruments;
        }catch (e){
            throw new ConflictException("Une erreur est survenue veuillez réessayer")
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

    async deleteInstrument(user: Partial<User | Professeur>, instrumentId: string) {
        const professor=user as  Etudiant
        if (user.role != RoleEnum.ETUDIANT) {
            throw new UnauthorizedException()
        }
        if (!this.appService.isObjectIdValid(instrumentId)) {
            throw new BadRequestException("L'id est invalide")
        }
        const instrument = await this.instrumentService.getInstrumentById(instrumentId)
        if (!instrument){
            throw new NotFoundException("L'instrument n'existe pas")
        }
        if (!professor.instruments.find((instrument)=> instrument._id==instrumentId)){
            throw new NotFoundException("L'instrument n'existe pas")
        }
        try {
            return await this.etudiantModel.updateOne(
                {_id : user._id},
                {
                    $pull : { instruments : instrumentId}
                }
            )
        }catch (e) {
            throw new ConflictException("Une erreur est survenue lors de la suppression")
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
