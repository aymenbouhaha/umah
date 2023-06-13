import {BadRequestException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Lecon, LeconDocument} from "./schema/lecon.schema";
import {Model} from "mongoose";
import {Demande} from "../demande/schema/demande.schema";
import {User} from "../user/schema/user.schema";
import {RoleEnum} from "../user/enum/role.enum";
import {AppService} from "../app.service";
import {ProfesseurService} from "../professeur/professeur.service";
import {SELECT_STRING} from "../user/generics/constants";
import {Professeur} from "../professeur/schema/professeur.schema";

@Injectable()
export class LeconService {

    constructor(
        @InjectModel(Lecon.name)
        private courseModel : Model<LeconDocument>,
        private appService : AppService,
        private profService : ProfesseurService
    ) {
    }


    createCourse(request : Demande){
        const lecon = new this.courseModel({
            instrument : request.instrument,
            professeur : request.professeur,
            date : request.date,
            etudiant: request.etudiant
        })
        return lecon.save()
    }


    getAllCourse(user : Partial<User>){
        if (user.role==RoleEnum.ADMIN){
            return this.courseModel.find({},{},{
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
        }else if (user.role==RoleEnum.ETUDIANT){
            return this.courseModel.find({etudiant : user._id},{},{
                populate : [
                    {
                        path : "instrument",
                    },
                    {
                        path : "professeur",
                        select : SELECT_STRING
                    },

                ]
            })
        }else {
            return this.courseModel.find({professeur : user._id},{},{
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


    async deleteCourse(user : Partial<Professeur>  , courseId: string) {
        if (user.role!=RoleEnum.PROFESSEUR){
            throw new UnauthorizedException()
        }
        if (!this.appService.isObjectIdValid(courseId)) {
            throw new BadRequestException("L'id est invalide")
        }
        if (!user.lecons.find((lecon)=>lecon._id==courseId)){
            throw new NotFoundException("Le cours n'existe pas")
        }
        await this.profService.updateProfesseurWithPredicate(user._id,{ $pull: { lecons: courseId } })
        return await this.courseModel.deleteOne({_id : courseId}).exec()
    }



}
