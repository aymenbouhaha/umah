import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {InjectModel} from "@nestjs/mongoose";
import {Professeur, ProfesseurDocument} from "./schema/professeur.schema";
import {Model} from "mongoose";
import * as bcrypt from 'bcrypt';
import {SignUpProfesseurDto} from "./dto/sign-up-professeur.dto";
import {SignUpDto} from "../user/dto/sign-up.dto";
import {RoleEnum} from "../user/enum/role.enum";
import {User} from "../user/schema/user.schema";
import {UpdateUserDto} from "../user/dto/update-user.dto";
import {AssginInstrumentDto} from "./dto/assgin-instrument.dto";
import {Instrument} from "../instrument/schema/instrument.schema";
import {InstrumentService} from "../instrument/instrument.service";
import {AppService} from "../app.service";
import {ChangePasswordDto} from "../user/dto/change-password.dto";

@Injectable()
export class ProfesseurService {

    constructor(
        private userService  : UserService,
        @InjectModel(Professeur.name)
        private professeurModel : Model<ProfesseurDocument>,
        private instrumentService : InstrumentService,
        private appService : AppService
    ) {
    }


    async signUpProfesseur(signUpProfesseurDto : SignUpProfesseurDto){
        const user=await this.userService.findUserByEmailWithPassword(signUpProfesseurDto.email)
        if (user){
            throw new BadRequestException("un utilisateur avec ce mail existe deja")
        }
        const salt = await bcrypt.genSalt();
        const password = await bcrypt.hash(signUpProfesseurDto.password,salt)
        const prof=new this.professeurModel({
            ...signUpProfesseurDto,
            password : password,
            salt : salt,
            role : RoleEnum.PROFESSEUR,
            cin : signUpProfesseurDto.cin
        })
        const userSignUpDto : SignUpDto={
            ...signUpProfesseurDto,
            password : password,
        }
        try {
            await this.userService.signUpUser(userSignUpDto,RoleEnum.PROFESSEUR, salt)
        }catch (e) {
            throw e
        }
        return await prof.save()

    }

    findProf(email : string){
        return this.professeurModel.findOne({email : email},{password: 0, salt : 0},{populate : ["instruments"]})
    }

    findByMail(email: string) {
        return this.professeurModel.findOne({email: email},{password : 0 , salt : 0},{
            populate : ["instruments"]
        });
    }



    async changePassword(user: Partial<User>, changePasswordDto: ChangePasswordDto) {
        const professor = await this.professeurModel.findOne({email : user.email})
        const previousPasswordHashed= await bcrypt.hash(changePasswordDto.previousPassword,professor.salt)
        if (previousPasswordHashed!=professor.password){
            throw new BadRequestException("Mot de passe invalide")
        }
        const newPasswordHashed= await bcrypt.hash(changePasswordDto.newPassword,professor.salt)
        try {
            await this.userService.changePassword(user.email,newPasswordHashed)
            return  await this.professeurModel.updateOne({email : user.email},{password : newPasswordHashed})
        }catch (e) {
            throw new ConflictException("Une erreur est survenue")
        }
    }


    async addProfilePicture(user: Partial<User>, image: Express.Multer.File) {
        const profileImage = this.userService.resolveProfileImage(image)
        try {
            await this.userService.addProfilePicture(user.email,profileImage)
            await this.professeurModel.updateOne({email : user.email},{profileImage: profileImage}).exec()
            return {
                profileImage: profileImage
            };
        } catch (e) {
            throw new ConflictException("Une Erreur est survenue")
        }
    }


    async assignInstrument(user: Partial<User>, instrumentsDto: AssginInstrumentDto) {
        if (user.role != RoleEnum.PROFESSEUR) {
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
            await this.professeurModel.updateOne({email : user.email},{$push : {instruments : {$each : instrumentsDto.idList}}},{new : true})
                .exec()
            return instruments;
        }catch (e){
            throw new ConflictException("Une erreur est survenue veuillez réessayer")
        }
    }


    findAll(){
        return this.professeurModel.aggregate([
            {
                $lookup: {
                    from: 'lecons',
                    localField: '_id',
                    foreignField: 'professeur',
                    as: 'lecons',
                },
            },
            {
                $lookup: {
                    from: 'instruments',
                    localField: 'instruments',
                    foreignField: '_id',
                    as: 'instrumentObjects',
                },
            },
            {
                $addFields: {
                    leconsBeforeToday: {
                        $filter: {
                            input: '$lecons',
                            as: 'lecon',
                            cond: {
                                $lt: ['$$lecon.date', new Date()],
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    firstname : 1,
                    lastname : 1,
                    phoneNumber:1,
                    dateBirth:1,
                    email:1,
                    profileImage:1,
                    role :1,
                    cin :1,
                    address :1,
                    instruments : '$instrumentObjects',
                    courseCount: {
                        $size: '$leconsBeforeToday',
                    },
                },
            },
        ]);
    }


    updateProfesseurWithPredicate(profId : string,predicate){
        return this.professeurModel.updateOne({_id : profId},predicate).exec()
    }


    async updateProfesseur(user: Partial<User>, updateEtudiantDto: UpdateUserDto) {
        if (user.role!=RoleEnum.PROFESSEUR) {
            throw new UnauthorizedException()
        }
        try {
            const newProfesseur = await this.professeurModel.updateOne(
                {email : user.email},
                {...updateEtudiantDto},
                {
                    projection :{password : 0 , salt : 0},
                    new : true
                }
            ).exec()
            const newUser = await this.userService.updateUser(user, updateEtudiantDto)
            return newProfesseur
        }catch (e) {
            throw new ConflictException("Une erreur est survenue veuillez réessayer")
        }
    }

    async deleteInstrument(user: Partial<User | Professeur>, instrumentId: string) {
        const professor=user as  Professeur
        if (user.role != RoleEnum.PROFESSEUR) {
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
            return await this.professeurModel.updateOne(
                {_id : user._id},
                {
                    $pull : { instruments : instrumentId}
                }
            )
        }catch (e) {
            throw new ConflictException("Une erreur est survenue lors de la suppression")
        }
    }


    async findById(id : string){
        return this.professeurModel.findById(id, {password : 0 , salt : 0},{
            populate : ["instruments"]
        })
    }


    async deleteProfesseur(user : Partial<User>){
        if (user.role!=RoleEnum.PROFESSEUR){
            throw new UnauthorizedException()
        }
        try {
            const deletedProfesseur = await this.professeurModel.deleteOne({email : user.email}).exec()
            const deletedUser = await this.userService.deleteUser(user)
            return deletedProfesseur
        }catch (e) {
            throw new ConflictException("Une erreur est survenue veuillez réessayer")
        }
    }



}
