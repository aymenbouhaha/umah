import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import {User} from "../user/schema/user.schema";
import {RoleEnum} from "../user/enum/role.enum";
import {MakeRequestDto} from "./dto/make-request.dto";
import {ProfesseurService} from "../professeur/professeur.service";
import {InjectModel} from "@nestjs/mongoose";
import {Demande, DemandeDocument} from "./schema/demande.schema";
import  {Model} from "mongoose";
import {InstrumentService} from "../instrument/instrument.service";
import {ChangeStatusDto} from "./dto/change-status.dto";
import {AppService} from "../app.service";
import {LeconService} from "../lecon/lecon.service";
import {RequestStatus} from "./enum/request-status";
import {SELECT_STRING} from "../user/generics/constants";

@Injectable()
export class DemandeService {


    constructor(
        @InjectModel(Demande.name)
        private demandeModel : Model<DemandeDocument>,
        private professeurService : ProfesseurService,
        private instrumentService : InstrumentService,
        private appService : AppService,
        private leconService : LeconService
    ) {
    }


    async makeRequest(user: Partial<User>, makeRequestDto: MakeRequestDto) {
        if (user.role != RoleEnum.ETUDIANT) {
            throw new UnauthorizedException()
        }
        if (!this.appService.isObjectIdValid(makeRequestDto.profId)){
            throw new BadRequestException("L'id du prof est invalide")
        }
        const prof = await this.professeurService.findById(makeRequestDto.profId)
        if (!prof) {
            throw new NotFoundException("le professeur n'existe pas")
        }
        const instrument = await this.instrumentService.getInstrumentByName(makeRequestDto.instrumentName)
        if (!instrument || !prof.instruments.find((existingInstrument)=>instrument.name==existingInstrument.name)){
            throw new NotFoundException("L'instrument n'existe pas")
        }

        const request= new this.demandeModel({
            etudiant : user,
            professeur : prof,
            instrument : instrument,
            date : makeRequestDto.date
        })
        try {
            return await request.save()
        }catch (e){
            throw new ConflictException("Votre demande n'est pas envoyée veuillez réessayer")
        }
    }


    async updateRequestStatus(user : Partial<User>,changeStatusDto : ChangeStatusDto){
        if (user.role!=RoleEnum.PROFESSEUR){
            throw new UnauthorizedException()
        }
        if (!this.appService.isObjectIdValid(changeStatusDto.requestId)){
            throw new BadRequestException("L'id de la demande est invalide")
        }
        const request =await this.demandeModel.findById(changeStatusDto.requestId,{},{
            populate : [
                {
                    path : "instrument",
                },
                {
                    path : "etudiant",
                    select : SELECT_STRING
                },
                {
                    path : "professeur",
                    select : SELECT_STRING
                }
                ]
        })
        if (!request){
            throw new BadRequestException("La demande n'existe pas")
        }
        if (request.professeur._id.toString()!=user._id.toString()){
            throw new UnauthorizedException()
        }
        if (changeStatusDto.status==RequestStatus.REFUSED){
            return await this.demandeModel.updateOne({_id : changeStatusDto.requestId},{status : changeStatusDto.status}).exec()
        }else {
            try {
                const teacher=await this.professeurService.findByMail(user.email)
                const newCourse =await this.leconService.createCourse(request)
                teacher.lecons.push(newCourse)
                await teacher.save()
                await this.demandeModel.updateOne({_id: changeStatusDto.requestId}, {status : changeStatusDto.status}).exec()
                return newCourse
            }catch (e) {
                throw new ConflictException("Une erreur est survenue veuillez réessayer")
            }
        }
    }
    

    getAllRequest(user : Partial<User>){
        if (user.role==RoleEnum.ADMIN){
            return this.demandeModel.find({status : RequestStatus.PENDING},{},{
                populate : [
                    {
                        path : "instrument",
                    },
                    {
                        path : "etudiant",
                        select : SELECT_STRING
                    },
                    {
                        path : "professeur",
                        select : SELECT_STRING
                    }
                ]
            })
        }if (user.role==RoleEnum.ETUDIANT){
            return this.demandeModel.find({status : { $in : [RequestStatus.ACCEPTED, RequestStatus.REFUSED]} , etudiant : user._id},{},{
                populate : [
                    {
                        path : "instrument",
                    },
                    {
                        path : "professeur",
                        select : SELECT_STRING
                    }
                ]
            })
        }else {
            return this.demandeModel.find({status : RequestStatus.PENDING , professeur : user._id},{},{
                populate : [
                    {
                        path : "instrument",
                    },
                    {
                        path : "etudiant",
                        select : SELECT_STRING
                    },
                ]
            })
        }
    }




}
