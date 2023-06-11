import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Lecon, LeconDocument} from "./schema/lecon.schema";
import {Model} from "mongoose";
import {Demande} from "../demande/schema/demande.schema";
import {User} from "../user/schema/user.schema";
import {RoleEnum} from "../user/enum/role.enum";

@Injectable()
export class LeconService {

    constructor(
        @InjectModel(Lecon.name)
        private courseModel : Model<LeconDocument>
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
            return this.courseModel.find({etudiant : user},{},{
                populate : ["instrument", "professeur"]
            })
        }else {
            return this.courseModel.find({professeur : user},{},{
                populate : ["instrument", "etudiant"]
            })
        }
    }




}
