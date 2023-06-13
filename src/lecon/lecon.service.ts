import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Lecon, LeconDocument} from "./schema/lecon.schema";
import {Model} from "mongoose";
import {Demande} from "../demande/schema/demande.schema";
import {User} from "../user/schema/user.schema";
import {RoleEnum} from "../user/enum/role.enum";
import {AppService} from "../app.service";
import {ProfesseurService} from "../professeur/professeur.service";

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
                populate : ["instrument", "etudiant", "professeur"]
            })
        }else if (user.role==RoleEnum.ETUDIANT){
            return this.courseModel.find({etudiant : user._id},{},{
                populate : ["instrument", "professeur"]
            })
        }else {
            return this.courseModel.find({professeur : user._id},{},{
                populate : ["instrument", "etudiant"]
            })
        }
    }


    async deleteCourse(user: Partial<User>, courseId: string) {
        if (!this.appService.isObjectIdValid(courseId)) {
            throw new BadRequestException("L'id est invalide")
        }
        const course = await this.courseModel.findById(courseId)
        if (!course) {
            throw new NotFoundException("Le cours n'existe pas")
        }
        const associatedProf=course.professeur
        await this.profService.updateProfesseurWithPredicate(associatedProf._id,{ $pull: { lecons: courseId } })
    }



}
